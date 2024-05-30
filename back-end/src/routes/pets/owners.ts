import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { CONFLICT, CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory } from '../../middleware/auth'
import { OwnerAddValidator } from '../../validators/pet-validators'
import { authOwnership } from './owner-auth'

const OwnerRouter = Router({ mergeParams: true })

OwnerRouter.post('/', authMandatory, (req, res, next) => {
    authOwnership(req.params.pet_id, req.body.id)
        .then((result) => {
            if (!result) res.status(403).json(FORBIDDEN)
            else {
                const { user } = OwnerAddValidator.parse(req.body)
                const sql = 'INSERT INTO pet_own (pet_id, owner_id) VALUES ($1, $2)'
                return pool.query(sql, [req.params.pet_id, user])
            }
        })
        .then(() => res.status(201).json(CREATED))
        .catch((err) => {
            if (err.code === '23503') res.status(404).json(RESOURCE_NOT_FOUND)
            else if (err.code === '23505') res.status(409).json(CONFLICT)
            else next(err)
        })
})

OwnerRouter.delete('/rescind', authMandatory, (req, res, next) => {
    authOwnership(req.params.pet_id, req.body.id)
        .then((result) => {
            if (!result) res.status(403).json(FORBIDDEN)
            else {
                const sql = 'DELETE FROM pet_own WHERE pet_id = $1 AND owner_id = $2'
                return pool.query(sql, [req.params.pet_id, req.body.id])
            }
        })
        .then(() => res.status(204).send())
        .catch((err) => next(err))
})

export { OwnerRouter }
