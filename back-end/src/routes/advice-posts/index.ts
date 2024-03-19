import { Router } from 'express'
import format from 'pg-format'
import { pool } from '../../helpers/pg-pool'
import { generateAdvicePostFetchQuery } from '../../helpers/query-generators/posts/generate-advice-post-fetch-query'
import { CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { AdvicePostAddValidator, AdvicePostFetchData, AdvicePostFetchValidator } from '../../validators/advice-post-validators'
import { ResponseRouter } from './responses'

const AdvicePostRouter = Router()

AdvicePostRouter.use('/responses', ResponseRouter)

AdvicePostRouter.post('/', authMandatory, (req, res, next) => {
    const { contents, pictures, tags, pets } = AdvicePostAddValidator.parse(req.body)

    const postSql = 'INSERT INTO advice_post (poster_id, contents) VALUES ($1, $2) RETURNING id'

    pool.query(postSql, [req.body.id, contents])
        .then(result => { 
            let picturesPromise
            let tagsPromise
            let petsPromise

            if (pictures !== undefined) {
                const picturesData = pictures.map(item => [item, result.rows[0].id])
                const picturesSql = format('INSERT INTO advice_post_picture (picture_path, post_id) VALUES %L', picturesData)
                picturesPromise = pool.query(picturesSql)
            } 

            if (tags !== undefined) {
                const tagsData = tags.map(item => [item, result.rows[0].id])
                const tagsSql = format('INSERT INTO advice_tagged (tag_id, post_id) VALUES %L', tagsData)
                tagsPromise = pool.query(tagsSql)
            } 

            if (pets !== undefined) {
                const petsData = pets.map(item => [item, result.rows[0].id])
                const petsSql = format('INSERT INTO advice_post_pet (pet_id, post_id) VALUES %L', petsData)
                petsPromise = pool.query(petsSql)
            }

            return Promise.all([picturesPromise, tagsPromise, petsPromise])
        }).then(() => res.status(201).json(CREATED))
        .catch(err => {
            if (err.code = 23503) res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

AdvicePostRouter.get('/', authOptional, (req, res, next) => {
    const data: AdvicePostFetchData = AdvicePostFetchValidator.parse(req.query)
    const sql = generateAdvicePostFetchQuery(data, req.body.auth ? req.body.id : undefined)

    pool.query(sql)
        .then(result => res.status(200).json(result.rows))
        .catch(err => next(err))
})

AdvicePostRouter.delete('/:id(\\d+)', authMandatory, (req, res, next) => {
    const idVerifySql = 'SELECT poster_id FROM advice_post WHERE id = $1'

    pool.query(idVerifySql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else if (result.rows[0].poster_id !== req.body.id) res.status(403).json(FORBIDDEN)
            else {
                const deleteSql = 'DELETE FROM advice_post WHERE id = $1'

                pool.query(deleteSql, [req.params.id])
                    .then(() => res.status(204))
                    .catch(err => next(err))
            }
        }).catch(err => next(err))
})

AdvicePostRouter.get('/:id(\\d+)', async (req, res, next) => {
    try {
        const postSql = `--sql
            SELECT CASE WHEN posted_as_anonymous THEN poster_id ELSE NULL AS "posterId",
                contents,
                date_posted AS "datePosted",
                response_count AS "responseCount",
                resolved
            FROM advice_post WHERE id = $1`
        const postPromise = pool.query(postSql, [req.params.id])

        const tagsSql = 'SELECT tag_id AS id FROM advice_tagged WHERE post_id = $1'
        const tagsPromise = pool.query(tagsSql, [req.params.id])

        const picturesSql = `--sql
            SELECT picture_id AS id
            FROM blog_post_picture
            WHERE blog_post_id = $1`
        const picturesPromise = pool.query(picturesSql, [req.params.id])

        const responsesSql = 'SELECT id FROM advice_reponse WHERE response_to = $1'
        const responsesPromise = pool.query(responsesSql, [req.params.id])

        const postData = await postPromise
        const tagsData = (await tagsPromise).rows.map(row => row.tag_id)
        const picturesData = (await picturesPromise).rows.map(row => row.picture_data)
        const responsesData = (await responsesPromise).rows.map(row => row.id)

        if (postData.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
        else res.status(200).send({ ...postData, tags: tagsData, pictures: picturesData, responses: responsesData })
    } catch (err) { next(err) }
})

export { AdvicePostRouter }

