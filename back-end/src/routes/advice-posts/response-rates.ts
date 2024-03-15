import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { CONFLICT, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory } from '../../middleware/auth'
import { ResponseRateAddValidator } from '../../validators/advice-post-validators'

const RateRouter = Router()

RateRouter.post('/', authMandatory, (req, res, next) => {
    const { isPositive } = ResponseRateAddValidator.parse(req.body)

    const sql = 'INSERT INTO response_rate (response_id, user_account_id, is_positive) VALUES ($1, $2, $3)'

    pool.query(sql, [req.params.id, req.body.id, isPositive])
        .then(() => res.status(204).send())
        .catch(err => {
            if (err.code === 23505) res.status(409).json(CONFLICT)
            else if (err.code === 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

RateRouter.delete('/', authMandatory, (req, res, next) => {
    const sql = 'DELETE FROM response_rate WHERE response_id = $1 AND user_account_id = $2'

    pool.query(sql, [req.params.id, req.body.id])
        .then(() => res.status(204).send())
        .catch(err => {
            if (err.code = 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

export { RateRouter }

