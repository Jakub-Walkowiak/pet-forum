import { Router } from "express"
import { pool } from "../../helpers/pg-pool"
import { CONFLICT, RESOURCE_NOT_FOUND } from "../../helpers/status-codes"
import { authMandatory } from "../../middleware/auth"

const LikeRouter = Router()

LikeRouter.post('/', authMandatory, (req, res, next) => {
    const sql = 'INSERT INTO post_like (post_id, user_account_id) VALUES ($1, $2)'

    pool.query(sql, [req.params.id, req.body.id])
        .then(() => res.status(204).send())
        .catch(err => {
            if (err.code === 23505) res.status(409).json(CONFLICT)
            else if (err.code === 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

LikeRouter.delete('/', authMandatory, (req, res, next) => {
    const sql = 'DELETE FROM post_like WHERE post_id = $1 AND user_account_id = $2'

    pool.query(sql, [req.params.id, req.body.id])
        .then(() => res.status(204).send())
        .catch(err => {
            if (err.code = 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

export { LikeRouter }

