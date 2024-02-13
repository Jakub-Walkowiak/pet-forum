import bcrypt from 'bcrypt'
import { Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../helpers/pg-pool'
import { generateAccountEditQuery } from '../helpers/query-generators/generate-account-edit-query'
import { ACCOUNT_NOT_FOUND, CONFLICT, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, LOGIN_FAILED } from '../helpers/status-codes'
import { authMandatory } from '../middleware/auth'
import { ChangePasswordValidator, EditValidator, LoginValidator, RegistrationValidator } from '../validators/account-validators'

const saltRounds = 10
const AccountRouter = Router()

AccountRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password, accountName, displayName } = RegistrationValidator.parse(req.body)

        const sql = 'INSERT INTO user_account (email, password, account_name, display_name) VALUES ($1, $2, $3, $4)'

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        pool.query(sql, [email, hashedPassword, accountName, displayName])
            .then(() => res.status(201).json(CREATED))
            .catch(err => {
                if (err.code === '23505') res.status(409).json(CONFLICT)
                else next(err)
            })
    } catch (err) { next(err) }
})

const attemptLogin = async (sql: string, indentifier: string, password: string, res: Response) => {
    const result = await pool.query(sql, [indentifier])

    if (result.rowCount === 0) res.status(404).json(ACCOUNT_NOT_FOUND)
    const verified = await bcrypt.compare(password, result.rows[0].password)

    if (verified) {
        const secret = process.env.JWT_SECRET
        
        if (secret === undefined) res.status(502).json(INTERNAL_SERVER_ERROR) 
        else {
            res.cookie('login_token', jwt.sign({ id: result.rows[0].id }, secret))
            res.status(204).send()
        }
    } else res.status(401).json(LOGIN_FAILED)
}

AccountRouter.post('/login', (req, res) => {
    const { email, accountName, password } = LoginValidator.parse(req.body)
    
    if (email) {
        const sql = 'SELECT password, account_name, id FROM user_account WHERE email = $1'
        attemptLogin(sql, email, password, res)
    } else if (accountName) {
        const sql = 'SELECT password, account_name FROM user_account WHERE account_name = $1'
        attemptLogin(sql, accountName, password, res)
    }
})

AccountRouter.delete('/', authMandatory, (req, res) => {
    const sql = 'DELETE FROM user_account WHERE id = $1'

    pool.query(sql, [req.body.id])
        .then(() => res.status(204).send())
})

AccountRouter.patch('/', authMandatory, (req, res, next) => {
    const sql = generateAccountEditQuery(EditValidator.parse(req.body), req.body.id)
    
    if (sql !== '') {
        pool.query(sql)
            .then(() => res.status(204).send())
            .catch(err => {
                if (err.code === '23505') res.status(409).json(CONFLICT)
                else next(err)
            })
    } else res.status(204).send()
})

AccountRouter.patch('/password', authMandatory, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = ChangePasswordValidator.parse(req.body)
        const getSql = 'SELECT password FROM user_account WHERE id = $1'

        const result = await pool.query(getSql, [req.body.id])
        const verified = await bcrypt.compare(currentPassword, result.rows[0].password)

        if (verified) {
            const changeSql = 'UPDATE user_account SET password = $1 WHERE id = $2'
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
            pool.query(changeSql, [hashedPassword, req.body.id])
                .then(() => res.status(204).send())
        } else { res.status(403).json(FORBIDDEN) }
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)', (req, res) => {
    const sql = `--sql
        SELECT account_name,
               display_name,
               follower_count,
               following_count,
               date_created,
               running_response_score,
               net_positive_responses,
               net_negative_responses,
               best_responses,
               blog_post_count,
               reply_count,
               advice_count,
               response_count,
               owned_pet_count
        FROM user_account
        WHERE id = $1`

    pool.query(sql, [req.params.id])
        .then(result => res.status(200).send(result.rows))
})

export { AccountRouter }

