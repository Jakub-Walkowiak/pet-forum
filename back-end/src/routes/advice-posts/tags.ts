import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { CONFLICT, CREATED, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory } from '../../middleware/auth'
import { AdviceTagAddValidator, AdviceTagFetchValidator } from '../../validators/advice-post-validators'

const TagRouter = Router({ mergeParams: true })

TagRouter.get('/', (req, res, next) => {
    const { limit, offset, nameQuery } = AdviceTagFetchValidator.parse(req.query)

    const nameFilter = nameQuery !== undefined ? `WHERE LOWER(tag_name) LIKE LOWER(\'%${nameQuery}%\')` : ''
    const sql = `--sql
        SELECT id FROM advice_tag
        ${nameFilter} 
        LIMIT $1 OFFSET $2`

    pool.query(sql, [limit, offset])
        .then(result => res.status(200).json(result))
        .catch(err => next(err))
})

TagRouter.get('/:id(\\d+)', (req, res, next) => {
    const sql = 'SELECT tag_name AS 'tagName', times_used AS 'timesUsed' FROM advice_tag WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else res.status(200).json(result)
        }).catch(err => next(err))
})

TagRouter.post('/', authMandatory, (req, res, next) => {
    const { name } = AdviceTagAddValidator.parse(req.body)

    const sql = 'INSERT INTO advice_tag (tag_name) VALUES ($1)'

    pool.query(sql, [name])
        .then(() => res.status(201).json(CREATED))
        .catch(err => {
            if (err.code === 23505) res.status(409).send(CONFLICT)
            else next(err)
        })
})

export { TagRouter }

