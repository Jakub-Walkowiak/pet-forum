import bcrypt from 'bcrypt'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../../helpers/pg-pool'
import { ACCOUNT_NOT_FOUND, INTERNAL_SERVER_ERROR, LOGIN_FAILED } from '../../helpers/status-codes'

export const attemptLogin = async (sql: string, indentifier: string, password: string, res: Response) => {
    const result = await pool.query(sql, [indentifier])

    if (result.rowCount === 0) res.status(404).json(ACCOUNT_NOT_FOUND)
    else {
        const verified = await bcrypt.compare(password, result.rows[0].password)

        if (verified) {
            const secret = process.env.JWT_SECRET
            
            if (secret === undefined) res.status(500).json(INTERNAL_SERVER_ERROR) 
            else {
                res.cookie('login_token', jwt.sign({ id: result.rows[0].id }, secret), { maxAge: 31560000000 })
                res.status(204).send()
            }
        } else res.status(401).json(LOGIN_FAILED)
    }
}