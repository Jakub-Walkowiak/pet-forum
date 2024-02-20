import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { generateBlogPostFetchQuery } from '../../helpers/query-generators/posts/generate-blog-post-fetch-query'
import { CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { BlogPostAddValidator, BlogPostFetchData, BlogPostFetchValidator } from '../../validators/blog-post-validators'
import { LikeRouter } from './likes'

const BlogPostRouter = Router()

BlogPostRouter.use('/like', LikeRouter)

BlogPostRouter.post('/', authMandatory, (req, res, next) => {
    const { contents, replyTo } = BlogPostAddValidator.parse(req.body)

    const sql = 'INSERT INTO blog_post (poster_id, contents, reply_to) VALUES ($1, $2, $3)'

    pool.query(sql, [req.body.id, contents, replyTo])
        .then(() => res.status(201).json(CREATED))
        .catch(err => {
            if (err.code = 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })

    
})

BlogPostRouter.get('/', authOptional, (req, res) => {
    const data: BlogPostFetchData = BlogPostFetchValidator.parse(req.query)
    const sql = generateBlogPostFetchQuery(data, req.body.auth ? req.body.id : undefined)

    pool.query(sql)
        .then(result => res.status(200).json(result.rows))
})

BlogPostRouter.delete('/:id(\\d+)', authMandatory, (req, res) => {
    const idVerifySql = 'SELECT poster_id FROM blog_post WHERE id = $1'

    pool.query(idVerifySql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else if (result.rows[0].poster_id !== req.body.id) res.status(403).json(FORBIDDEN)
            else {
                const deleteSql = 'DELETE FROM blog_post WHERE id = $1'

                pool.query(deleteSql, [req.params.id])
                    .then(() => res.status(204))
            }
        })
})

BlogPostRouter.get('/:id(\\d+)', (req, res) => {
    const sql = 'SELECT * FROM blog_post WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then(result => res.status(200).json(result.rows))
})

export { BlogPostRouter }

