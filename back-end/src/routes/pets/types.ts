import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory } from '../../middleware/auth'
import { PetTypeAddValidator, PetTypeFetchValidator } from '../../validators/pet-validators'

const TypeRouter = Router({ mergeParams: true })

TypeRouter.get('/', (req, res, next) => {
    const { limit, offset, nameQuery, exactMatch } = PetTypeFetchValidator.parse(req.query)

    const nameFilter = nameQuery !== undefined ? 
        exactMatch === false
            ? `WHERE LOWER(type_name) LIKE LOWER(\'%${nameQuery}%\')` 
            : `WHERE type_name = '${nameQuery}'`
        : ''
    const sql = `--sql
        SELECT id FROM pet_type
        ${nameFilter} 
        LIMIT $1 OFFSET $2`

    pool.query(sql, [limit, offset])
        .then(result => res.status(200).json(result.rows.map(row => row.id)))
        .catch(err => next(err))
})

TypeRouter.get('/:id(\\d+)', (req, res, next) => {
    const sql = 'SELECT type_name AS "typeName", times_used AS "timesUsed" FROM pet_type WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
            else res.status(200).json(result.rows[0])
        }).catch(err => next(err))
})

TypeRouter.post('/', authMandatory, (req, res, next) => {
    const { name } = PetTypeAddValidator.parse(req.body)

    const sql = 'INSERT INTO pet_type (type_name) VALUES ($1) RETURNING id'

    pool.query(sql, [name])
        .then(result => res.status(201).json(result.rows[0]))
        .catch(err => {
            if (err.code === '23505') { 
                const confictSql = 'SELECT id FROM pet_type WHERE type_name = $1'
                pool.query(confictSql, [name]).then(result => res.status(409).send(result.rows[0]))
            } else next(err)
        })
})

export { TypeRouter }

