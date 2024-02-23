import { Router } from "express"
import { pool } from "../../helpers/pg-pool"
import { CONFLICT, CREATED, RESOURCE_NOT_FOUND } from "../../helpers/status-codes"
import { authMandatory } from "../../middleware/auth"
import { BlogTagAddValidator, BlogTagFetchValidator } from "../../validators/blog-post-validators"

const TagRouter = Router()

TagRouter.get('/', (req, res) => {
    const { limit, offset, nameQuery} = BlogTagFetchValidator.parse(req.query)

    const nameFilter = nameQuery !== undefined ? `WHERE LOWER(tag_name) LIKE LOWER(\'%${nameQuery}%\')` : ''
    const sql = `--sql
        SELECT id FROM blog_tag
        ${nameFilter} 
        LIMIT $1 OFFSET $2`

    pool.query(sql, [limit, offset])
        .then(result => res.status(200).json(result))
})

TagRouter.get('/:id(\\d+)', (req, res) => {
    const sql = 'SELECT tag_name, times_used FROM blog_tag WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else res.status(200).json(result)
        })
})

TagRouter.post('/', authMandatory, (req, res, next) => {
    const { name } = BlogTagAddValidator.parse(req.body)

    const sql = 'INSERT INTO blog_tag (tag_name) VALUES ($1)'

    pool.query(sql, [name])
        .then(() => res.status(201).json(CREATED))
        .catch(err => {
            if (err.code === 23505) res.status(409).send(CONFLICT)
            else next(err)
        })
})

export { TagRouter }

