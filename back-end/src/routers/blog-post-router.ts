import { Router } from 'express'
import { pool } from '../helpers/pg-pool'
import { BlogPostAddValidator, BlogPostFetchData, BlogPostFetchValidator } from '../validators/blog-post-validators'
import { CREATED } from '../helpers/status-codes'
import { OK } from 'zod'
import { authOptional } from '../middleware/auth'
import { generatePostFetchQuery } from '../helpers/generate-post-fetch-query'

const BlogPostRouter = Router()

BlogPostRouter.post('/', (req, res) => {
    const { posterId, contents, replyTo } = BlogPostAddValidator.parse(req.body)
    const sql = 'INSERT INTO blog_post (poster_id, contents, reply_to) VALUES $1, $2, $3'

    pool.query(sql, [posterId, contents, replyTo])
        .then(() => res.status(201).json(CREATED))
})

BlogPostRouter.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM blog_post WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then(() => res.json(200).json(OK))
})

BlogPostRouter.get('/', authOptional, (req, res) => {
    const data: BlogPostFetchData = BlogPostFetchValidator.parse(req.query)
    const sql = generatePostFetchQuery(data, req.body.auth ? req.body.id : undefined)

    pool.query(sql)
        .then(result => res.status(200).json(result.rows))
})

BlogPostRouter.get('/:id(\\d+)', (req, res) => {
    const sql = 'SELECT * FROM blog_post WHERE id = $1'

    pool.query(sql, [req.params.id])
})