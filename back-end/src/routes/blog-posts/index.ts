import { Router } from 'express'
import format from 'pg-format'
import { pool } from '../../helpers/pg-pool'
import { generateBlogPostFetchQuery } from '../../helpers/query-generators/posts/generate-blog-post-fetch-query'
import { FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { BlogPostAddValidator, BlogPostFetchData, BlogPostFetchValidator } from '../../validators/blog-post-validators'
import { authOwnership } from '../pets/owner-auth'
import { LikeRouter } from './likes'
import { TagRouter } from './tags'

const BlogPostRouter = Router()

BlogPostRouter.use('/:id(\\d+)/likes', LikeRouter)
BlogPostRouter.use('/tags', TagRouter)

BlogPostRouter.post('/', authMandatory, async (req, res, next) => {
    try {
        const { contents, replyTo, pictures, tags, pets } = BlogPostAddValidator.parse(req.body)

        const doQuery = () => {
            const postSql = 'INSERT INTO blog_post (poster_id, contents, reply_to) VALUES ($1, $2, $3) RETURNING id'
            let idCreated: number

            pool.query(postSql, [req.body.id, contents, replyTo])
                .then((result) => {
                    idCreated = result.rows[0].id

                    let picturesPromise
                    let tagsPromise
                    let petsPromise

                    if (pictures !== undefined && pictures.length > 0) {
                        const picturesData = pictures.map((item) => [item, result.rows[0].id])
                        const picturesSql = format(
                            'INSERT INTO blog_post_picture (picture_id, post_id) VALUES %L',
                            picturesData,
                        )
                        picturesPromise = pool.query(picturesSql)
                    }

                    if (tags !== undefined && tags.length > 0) {
                        const tagsData = tags.map((item) => [item, result.rows[0].id])
                        const tagsSql = format('INSERT INTO blog_tagged (tag_id, post_id) VALUES %L', tagsData)
                        tagsPromise = pool.query(tagsSql)
                    }

                    if (pets !== undefined && pets.length > 0) {
                        const petsData = pets.map((item) => [item, result.rows[0].id])
                        const petsSql = format('INSERT INTO blog_post_pet (pet_id, post_id) VALUES %L', petsData)
                        petsPromise = pool.query(petsSql)
                    }

                    return Promise.all([picturesPromise, tagsPromise, petsPromise])
                })
                .then(() => res.status(201).json({ id: idCreated }))
                .catch((err) => {
                    if (err.code === '23503') res.status(404).json({ id: idCreated })
                    else next(err)
                })
        }

        if (pets) {
            const notOwned = (await Promise.all(pets.map((pet) => authOwnership(pet.toString(), req.body.id))))
                .map((owned, idx): [boolean, number] => [owned, idx])
                .filter(([owned]) => !owned)
                .map(([_, idx]) => pets[idx])

            if (notOwned.length > 0) res.status(403).json(notOwned)
            else doQuery()
        } else doQuery()
    } catch (err) {
        next(err)
    }
})

BlogPostRouter.get('/', authOptional, async (req, res, next) => {
    try {
        const data: BlogPostFetchData = BlogPostFetchValidator.parse(req.query)
        const sql = generateBlogPostFetchQuery(data, req.body.auth ? req.body.id : undefined)

        if (data.likedBy !== undefined && (!req.body.auth || data.likedBy !== req.body.id)) {
            const verifyPrivacySql = 'SELECT likes_visible FROM user_account WHERE id = $1'
            const result = await pool.query(verifyPrivacySql, [data.likedBy])
            if (result.rowCount && !result.rows[0].likes_visible) res.status(403).send(FORBIDDEN)
        }

        pool.query(sql)
            .then((result) => res.status(200).json(result.rows.map((row) => row.id)))
            .catch((err) => next(err))
    } catch (err) {
        next(err)
    }
})

BlogPostRouter.delete('/:id(\\d+)', authMandatory, (req, res, next) => {
    const idVerifySql = 'SELECT poster_id FROM blog_post WHERE id = $1'

    pool.query(idVerifySql, [req.params.id])
        .then((result) => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else if (result.rows[0].poster_id !== req.body.id) res.status(403).json(FORBIDDEN)
            else {
                const deleteSql = 'DELETE FROM blog_post WHERE id = $1'

                pool.query(deleteSql, [req.params.id]).then(() => res.status(204).send())
            }
        })
        .catch((err) => next(err))
})

BlogPostRouter.get('/:id(\\d+)', authOptional, async (req, res, next) => {
    try {
        const postSql = `--sql
            SELECT poster_id AS "posterId",
                contents,
                reply_to AS "replyTo",
                date_posted AS "datePosted",
                reply_count AS "replyCount",
                like_count AS "likeCount"
            FROM blog_post WHERE id = $1`
        const postPromise = pool.query(postSql, [req.params.id])

        const tagsSql = 'SELECT tag_id AS id FROM blog_tagged WHERE post_id = $1'
        const tagsPromise = pool.query(tagsSql, [req.params.id])

        const petsSql = 'SELECT pet_id AS id FROM blog_post_pet WHERE post_id = $1'
        const petsPromise = pool.query(petsSql, [req.params.id])

        const picturesSql = `--sql
            SELECT picture_id AS id
            FROM blog_post_picture
            WHERE post_id = $1`
        const picturesPromise = pool.query(picturesSql, [req.params.id])

        const likedSql = 'SELECT COUNT(*) AS count FROM post_like WHERE post_id = $1 AND user_account_id = $2'
        const likedPromise = pool.query(likedSql, [req.params.id, req.body.id])

        const postData = await postPromise
        const tagsData = (await tagsPromise).rows.map((row) => row.id)
        const petsData = (await petsPromise).rows.map((row) => row.id)
        const picturesData = (await picturesPromise).rows.map((row) => row.id)
        const liked = (await likedPromise).rows[0].count > 0

        if (postData.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
        else
            res.status(200).send({
                ...postData.rows[0],
                tags: tagsData,
                images: picturesData,
                liked,
                pets: petsData,
            })
    } catch (err) {
        next(err)
    }
})

export { BlogPostRouter }
