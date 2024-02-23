import { Router } from 'express'
import format from 'pg-format'
import { pool } from '../../helpers/pg-pool'
import { generateBlogPostFetchQuery } from '../../helpers/query-generators/posts/generate-blog-post-fetch-query'
import { CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { BlogPostAddValidator, BlogPostFetchData, BlogPostFetchValidator } from '../../validators/blog-post-validators'
import { LikeRouter } from './likes'
import { TagRouter } from './tags'

const BlogPostRouter = Router()

BlogPostRouter.use('/likes', LikeRouter)
BlogPostRouter.use('/tags', TagRouter)

BlogPostRouter.post('/', authMandatory, (req, res, next) => {
    const { contents, replyTo, pictures } = BlogPostAddValidator.parse(req.body)

    const postSql = 'INSERT INTO blog_post (poster_id, contents, reply_to) VALUES ($1, $2, $3)'

    pool.query(postSql, [req.body.id, contents, replyTo])
        .then(() => { 
            if (pictures === undefined) res.status(201).json(CREATED)
            else {
                const picturesData = pictures.map(item => [item])
                const picturesSql = format('INSERT INTO blog_post_picture VALUES %L', picturesData)
                pool.query(picturesSql)
                    .then(() => res.status(201).json(CREATED))
            }
        })
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

BlogPostRouter.get('/:id(\\d+)', async (req, res, next) => {
    try {
        const postSql = `--sql
            SELECT poster_id,
                contents,
                like_count,
                reply_to,
                date_posted,
                reply_count
            FROM blog_post WHERE id = $1`
        const postPromise = pool.query(postSql, [req.params.id])
           
        const tagsSql = 'SELECT tag_id FROM blog_tagged WHER post_id = $1'
        const tagsPromise = pool.query(tagsSql, [req.params.id])

        const picturesSql = `--sql
            SELECT picture_id
            FROM blog_post_picture
            WHERE blog_post_id = $1`
        const picturesPromise = pool.query(picturesSql, [req.params.id])

        const postData = await postPromise
        const tagsData = (await tagsPromise).rows.map(row => row.tag_id)
        const picturesData = (await picturesPromise).rows.map(row => row.picture_data)

        if (postData.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
        else res.status(200).send({ ...postData, tags: tagsData, pictures: picturesData })
    } catch (err) { next(err) }
})

export { BlogPostRouter }

