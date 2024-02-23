import bcrypt from 'bcrypt'
import { Response } from "express"
import jwt from 'jsonwebtoken'
import { pool } from "../../helpers/pg-pool"
import { ACCOUNT_NOT_FOUND, INTERNAL_SERVER_ERROR, LOGIN_FAILED } from "../../helpers/status-codes"
import { AccountFollowFetchData } from '../../validators/account-validators'

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

export const getFollowed = async (of: string, data: AccountFollowFetchData) => {
    const sql = 'SELECT followed_id FROM follow WHERE follower_id = $1 ORDER BY $2 $3 LIMIT $4 OFFSET $5'

    return (await pool.query(sql, [of, data.orderBy, data.orderMode, data.limit, data.offset])).rows
}

export const getFollowers = async (of: string, as: number | undefined, data: AccountFollowFetchData) => {
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
        SELECT follower_id FROM follow
        WHERE followed_id = $1 
        AND id NOT IN (
            SELECT id FROM user_account WHERE NOT followed_visible
        ) ORDER BY $2 $3 LIMIT $4 OFFSET $5`

    return selfHasPrivateFollowsAppendix.concat((await pool.query(fetchSql, [of, data.orderBy, data.orderMode, data.limit, data.offset])).rows)
}