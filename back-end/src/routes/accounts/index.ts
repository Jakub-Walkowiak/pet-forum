import bcrypt from 'bcrypt'
import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { generateAccountEditQuery } from '../../helpers/query-generators/generate-account-edit-query'
import { CONFLICT, CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { ChangePasswordValidator, EditValidator, LoginValidator, RegistrationValidator } from '../../validators/account-validators'
import { FollowRouter } from './follows'
import { attemptLogin, getFollowed, getFollowers } from './functions'

const saltRounds = 10
const AccountRouter = Router()

AccountRouter.use('/id(\\d+)/follow', FollowRouter)

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
               followed_count,
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
        .then(result => {
            if (result.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result.rows)
        })
})

AccountRouter.get('/:id(\\d+)/followed', authOptional, async (req, res, next) => {
    try {
        const privacySql = 'SELECT followed_visible FROM user_account WHERE id = $1'
        const shouldFetch = (req.body.auth && req.body.id === req.params.id) || (await pool.query(privacySql, [req.params.id])).rows[0].followed_visible

        if (shouldFetch) {
            const result = await getFollowed(req.params.id)
            if (result.length === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result)
        } else res.status(403).json(FORBIDDEN)
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)/followers', authOptional, async (req, res, next) => {
    try {
        let result

        if (req.body.auth) result = await getFollowers(req.params.id, req.body.id)
        else result = await getFollowers(req.params.id, undefined)

        if (result.length === 0) res.status(404).send(RESOURCE_NOT_FOUND)
        else res.status(200).json(result)
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)/mutuals', authOptional, async (req, res, next) => {
    try {
        const privacySql = 'SELECT followed_visible FROM user_account WHERE id = $1'
        const shouldFetch = (req.body.auth && req.body.id === req.params.id) || (await pool.query(privacySql, [req.params.id])).rows[0].followed_visible

        if (shouldFetch) {
            const followed = await getFollowed(req.params.id)
            const followers = req.body.auth
                ? await getFollowers(req.params.id, req.body.id)
                : await getFollowers(req.params.id, undefined)

            const result = followed.filter(value => followers.includes(value))
            if (result.length === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result)
        } else res.status(403).json(FORBIDDEN)
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)/likes', authOptional, async (req, res, next) => {
    try {
        if (!req.body.auth) {
            const verifyPrivacySql = 'SELECT likes_visible FROM user_account WHERE id = $1'
            if (!(await pool.query(verifyPrivacySql, [req.params.id])).rows[0].likes_visible) res.status(403).send(FORBIDDEN)
        }

        const fetchSql = 'SELECT post_id FROM post_like WHERE user_account_id = $1'

        pool.query(fetchSql, [req.params.id])
            .then(result => res.status(200).send(result.rows))
    } catch (err) { next(err) }
})

export { AccountRouter }

