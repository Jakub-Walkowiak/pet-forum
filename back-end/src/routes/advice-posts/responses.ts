import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { generateResponseFetchQuery } from '../../helpers/query-generators/posts/generate-response-fetch-query'
import { CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { AdvicePostAddValidator, ResponseFetchData, ResponseFetchValidator } from '../../validators/advice-post-validators'
import { RateRouter } from './response-rates'

const ResponseRouter = Router({ mergeParams: true })

ResponseRouter.use('/:id(\\d+)/rate', RateRouter)

ResponseRouter.post('/', authMandatory, (req, res, next) => {
    const { contents } = AdvicePostAddValidator.parse(req.body)

    const sql = 'INSERT INTO advice_response (poster_id, contents) VALUES ($1, $2)'

    pool.query(sql, [req.body.id, contents])
        .then(() => res.status(201).json(CREATED))
        .catch(err => {
            if (err.code = 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

ResponseRouter.get('/', authOptional, (req, res) => {
    const data: ResponseFetchData = ResponseFetchValidator.parse(req.query)
    const sql = generateResponseFetchQuery(data, req.body.auth ? req.body.id : undefined)

    pool.query(sql)
        .then(result => res.status(200).json(result.rows))
})

ResponseRouter.delete('/:id(\\d+)', authMandatory, (req, res, next) => {
    const idVerifySql = 'SELECT poster_id FROM advice_response WHERE id = $1'

    pool.query(idVerifySql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else if (result.rows[0].poster_id !== req.body.id) res.status(403).json(FORBIDDEN)
            else {
                const deleteSql = 'DELETE FROM advice_response WHERE id = $1'

                pool.query(deleteSql, [req.params.id])
                    .then(() => res.status(204))
                    .catch(err => next(err))
            }
        }).catch(err => next(err))
})

ResponseRouter.get('/:id(\\d+)', (req, res, next) => {
    const sql = `--sql
        SELECT reply_to AS "replyTo",
               poster_id AS "posterId",
               score,
               date_posted AS "datePosted"
        FROM advice_response`

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result.rows)
        }).catch(err => next(err))
})

export { ResponseRouter }

