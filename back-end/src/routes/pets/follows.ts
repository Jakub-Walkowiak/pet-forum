import { Router } from "express"
import { pool } from "../../helpers/pg-pool"
import { authMandatory } from "../../middleware/auth"
import { CONFLICT, RESOURCE_NOT_FOUND } from "../../helpers/status-codes"

const FollowRouter = Router({ mergeParams: true })

FollowRouter.post('/', authMandatory, (req, res, next) => {
    const sql = 'INSERT INTO pet_follow (pet_id, follower_id) VALUES ($1, $2)'

    pool.query(sql, [req.params.pet_id, req.body.id])
        .then(() => res.status(204).send())
        .catch(err => {
            if (err.code === '23505') res.status(409).json(CONFLICT)
            else if (err.code === '23503') res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

FollowRouter.delete('/', authMandatory, (req, res, next) => {
    const sql = 'DELETE FROM pet_follow WHERE pet_id = $1 AND follower_id = $2'
    pool.query(sql, [req.params.pet_id, req.body.id])
        .then(() => res.status(204).send())
        .catch(err => next(err))
})

export { FollowRouter }
