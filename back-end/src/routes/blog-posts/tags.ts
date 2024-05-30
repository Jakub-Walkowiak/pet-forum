import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { CONFLICT, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory } from '../../middleware/auth'
import { BlogTagAddValidator, BlogTagFetchValidator } from '../../validators/blog-post-validators'

const TagRouter = Router({ mergeParams: true })

TagRouter.get('/', (req, res, next) => {
    const { limit, offset, nameQuery, exactMatch } = BlogTagFetchValidator.parse(req.query)

    const nameFilter =
        nameQuery !== undefined
            ? exactMatch === false
                ? `WHERE LOWER(tag_name) LIKE LOWER(\'%${nameQuery}%\')`
                : `WHERE tag_name = '${nameQuery}'`
            : ''
    const sql = `--sql
        SELECT id FROM blog_tag
        ${nameFilter} 
        LIMIT $1 OFFSET $2`

    pool.query(sql, [limit, offset])
        .then((result) => res.status(200).json(result.rows.map((row) => row.id)))
        .catch((err) => next(err))
})

TagRouter.get('/:id(\\d+)', (req, res, next) => {
    const sql = 'SELECT tag_name AS "tagName", times_used AS "timesUsed" FROM blog_tag WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then((result) => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else res.status(200).json(result.rows[0])
        })
        .catch((err) => next(err))
})

TagRouter.post('/', authMandatory, (req, res, next) => {
    const { name } = BlogTagAddValidator.parse(req.body)

    const sql = 'INSERT INTO blog_tag (tag_name) VALUES ($1) RETURNING id'

    pool.query(sql, [name])
        .then((result) => res.status(201).json(result.rows[0]))
        .catch((err) => {
            if (err.code === '23505') res.status(409).send(CONFLICT)
            else next(err)
        })
})

export { TagRouter }
