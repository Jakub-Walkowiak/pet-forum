import { Router, Request, Response } from 'express'
import { pool } from '../helpers/pg-pool'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { CONFLICT, ACCOUNT_NOT_FOUND, BAD_REQUEST, LOGIN_FAILED, OK, CREATED, INTERNAL_SERVER_ERROR } from '../helpers/status-codes'
const saltRounds = 10
const AccountRouter = Router()

const RegistrationValidator = z.object({
    email: z.string().email(),
    password: z.string().min(10).max(32).regex(/([\w~`!@#$%^&*()_\-\+={[}\]\|\\:;"',.?\/]+)/),
    accountName: z.string().min(1).max(50),
    displayName: z.string().min(1).max(50),
})

const LoginValidator = z
    .object({
        email: z.string().email().max(254).optional(),
        accountName: z.string().min(1).max(50).optional(),
        password: z.string().min(10).max(32).regex(/([\w~`!@#$%^&*()_\-\+={[}\]\|\\:;"',.?\/]+)/),
    })
    .refine(data => data.email || data.accountName, { message: "Either account name or email must be provided" })

AccountRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password, accountName, displayName } = RegistrationValidator.parse(req.body)

        const sql = 'INSERT INTO user_account (email, password, account_name, display_name) VALUES ($1, $2, $3, $4)'

        const hashed_password = await bcrypt.hash(password, saltRounds)
        pool.query(sql, [email, hashed_password, accountName, displayName])
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

        pool.query(sql, [email])
            .then(result => {
                if (result.rowCount === 0) res.status(404).json(ACCOUNT_NOT_FOUND)

                if (async () => await bcrypt.compare(result.rows[0].password, password)) {
                    const secret = process.env.JWT_SECRET
                    
                    if (secret === undefined) res.status(502).json(INTERNAL_SERVER_ERROR) 
                    else {
                        res.cookie('login_token', jwt.sign({ id: result.rows[0].id }, secret))
                        res.status(200).json(OK)
                    }
                } else res.status(401).json(LOGIN_FAILED)
            })
    } else if (accountName) {
        const sql = 'SELECT password, account_name FROM user_account WHERE account_name = $1'

        pool.query(sql, [accountName])
            .then(result => {
                if (result.rowCount === 0) res.status(404).json(ACCOUNT_NOT_FOUND)
                if (async () => await bcrypt.compare(result.rows[0].password, password)) {
                    const secret = process.env.JWT_SECRET
                    
                    if (secret === undefined) res.status(502).json(INTERNAL_SERVER_ERROR) 
                    else {
                        res.cookie('login_token', jwt.sign({ id: result.rows[0].id }, secret))
                        res.status(200).json(OK)
                    }
                } else res.status(401).json(LOGIN_FAILED)
            })
    } else res.send(400).json(BAD_REQUEST)
})

export { AccountRouter }