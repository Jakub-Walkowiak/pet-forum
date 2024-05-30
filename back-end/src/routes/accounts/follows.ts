import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { CONFLICT, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory } from '../../middleware/auth'

const FollowRouter = Router({ mergeParams: true })

FollowRouter.post('/', authMandatory, (req, res, next) => {
    const sql = 'INSERT INTO account_follow (followed_id, follower_id) VALUES ($1, $2)'

    pool.query(sql, [req.params.id, req.body.id])
        .then(() => res.status(204).send())
        .catch((err) => {
            if (err.code === '23505') res.status(409).json(CONFLICT)
            else if (err.code === '23503') res.status(404).json(RESOURCE_NOT_FOUND)
            else if (err.code === '23514') res.status(403).json(FORBIDDEN)
            else next(err)
        })
})

FollowRouter.delete('/', authMandatory, (req, res, next) => {
    const sql = 'DELETE FROM account_follow WHERE followed_id = $1 AND follower_id = $2'

    pool.query(sql, [req.params.id, req.body.id])
        .then(() => res.status(204).send())
        .catch((err) => next(err))
})

export { FollowRouter }
