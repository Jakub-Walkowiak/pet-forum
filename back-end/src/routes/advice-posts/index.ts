import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { generateAdvicePostFetchQuery } from '../../helpers/query-generators/posts/generate-advice-post-fetch-query'
import { CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { AdvicePostAddValidator, AdvicePostFetchData, AdvicePostFetchValidator } from '../../validators/advice-post-validators'
import { ResponseRouter } from './responses'

const AdvicePostRouter = Router()

AdvicePostRouter.use('/responses', ResponseRouter)

AdvicePostRouter.post('/', authMandatory, (req, res, next) => {
    const { contents } = AdvicePostAddValidator.parse(req.body)

    const sql = 'INSERT INTO advice_post (poster_id, contents) VALUES ($1, $2)'

    pool.query(sql, [req.body.id, contents])
        .then(() => res.status(201).json(CREATED))
        .catch(err => {
            if (err.code = 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

AdvicePostRouter.get('/', authOptional, (req, res) => {
    const data: AdvicePostFetchData = AdvicePostFetchValidator.parse(req.query)
    const sql = generateAdvicePostFetchQuery(data, req.body.auth ? req.body.id : undefined)

    pool.query(sql)
        .then(result => res.status(200).json(result.rows))
})

AdvicePostRouter.delete('/:id(\\d+)', authMandatory, (req, res) => {
    const idVerifySql = 'SELECT poster_id FROM advice_post WHERE id = $1'

    pool.query(idVerifySql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else if (result.rows[0].poster_id !== req.body.id) res.status(403).json(FORBIDDEN)
            else {
                const deleteSql = 'DELETE FROM advice_post WHERE id = $1'

                pool.query(deleteSql, [req.params.id])
                    .then(() => res.status(204))
            }
        })
})

AdvicePostRouter.get('/:id(\\d+)', (req, res) => {
    const sql = `--sql
        SELECT CASE WHEN posted_as_anonymous THEN poster_id ELSE NULL as poster,
               contents,
               date_posted,
               response_count,
               resolved
        FROM advice_post`

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result.rows)
        })
})

export { AdvicePostRouter }

