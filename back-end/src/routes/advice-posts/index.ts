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
    const { contents, pictures } = AdvicePostAddValidator.parse(req.body)

    const sql = 'INSERT INTO advice_post (poster_id, contents) VALUES ($1, $2)'

    pool.query(sql, [req.body.id, contents])
        .then(() => { 
            if (pictures === undefined) res.status(201).json(CREATED)
            else {
                const picturesData = pictures.map(item => [item])
                const picturesSql = format('INSERT INTO advice_post_picture VALUES %L', picturesData)
                pool.query(picturesSql)
                    .then(() => res.status(201).json(CREATED))
            }
        })
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

AdvicePostRouter.get('/:id(\\d+)', async (req, res, next) => {
    try {
        const postSql = `--sql
            SELECT CASE WHEN posted_as_anonymous THEN poster_id ELSE NULL as poster,
                contents,
                date_posted,
                response_count,
                resolved
            FROM advice_post WHERE id = $1`

        const postPromise = pool.query(postSql, [req.params.id])

        const picturesSql = `--sql
            SELECT picture_id
            FROM blog_post_picture
            WHERE blog_post_id = $1`

        const pictures = (await pool.query(picturesSql, [req.params.id])).rows.map(row => row.picture_data)

        const postData = await postPromise
        if (postData.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
        else res.status(200).send({ ...postData, pictures })
    } catch (err) { next(err) }
})

export { AdvicePostRouter }

