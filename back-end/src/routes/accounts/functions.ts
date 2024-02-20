import bcrypt from 'bcrypt'
import { Response } from "express"
import jwt from 'jsonwebtoken'
import { pool } from "../../helpers/pg-pool"
import { ACCOUNT_NOT_FOUND, INTERNAL_SERVER_ERROR, LOGIN_FAILED } from "../../helpers/status-codes"

export const attemptLogin = async (sql: string, indentifier: string, password: string, res: Response) => {
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

export const getFollowed = async (of: string) => {
    const sql = `--sql
        SELECT id FROM user_account
        WHERE id IN (
            SELECT followed_id FROM follow
            WHERE follower_id = $1
        )`

    return (await pool.query(sql, [of])).rows
}

export const getFollowers = async (of: string, as: number | undefined) => {
    let selfHasPrivateFollowsAppendix: Array<{id: number}> = []
    if (as !== undefined) {
        const appendixSql = `--sql
            SELECT id FROM user_account 
            WHERE NOT followed_visible AND id = $1
            AND id IN (
                SELECT follower_id FROM follow WHERE followed_id = $2
            )`
        
        selfHasPrivateFollowsAppendix = (await pool.query(appendixSql, [as, of])).rows
    }

    const fetchSql = `--sql
        SELECT id FROM user_account
        WHERE id IN (
            SELECT follower_id FROM follow
            WHERE followed_id = $1
        ) AND id NOT IN (
            SELECT id FROM user_account WHERE NOT followed_visible
        )`

    return (await pool.query(fetchSql, [of])).rows.concat(selfHasPrivateFollowsAppendix)
}