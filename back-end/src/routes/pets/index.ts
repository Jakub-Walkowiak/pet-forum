import { Router } from "express"
import format from "pg-format"
import { pool } from "../../helpers/pg-pool"
import { generatePetEditQuery } from "../../helpers/query-generators/pets/generate-pet-edit-query"
import { generatePetFetchQuery } from "../../helpers/query-generators/pets/generate-pet-fetch-query"
import { CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from "../../helpers/status-codes"
import { authMandatory } from "../../middleware/auth"
import { PetAddValidator, PetEditValidator, PetFetchValidator } from "../../validators/pet-validators"
import { authOwnership } from "./owner-auth"

const PetRouter = Router()

PetRouter.use('/:pet_id(\\d+)/owners')

PetRouter.post('/', authMandatory, (req, res) => {
    const { name, owners, sex, type } = PetAddValidator.parse(req.body)

    const petSql = 'INSERT INTO pet (name, type_id, sex) VALUES ($1, $2, $3) RETURNING id'

    pool.query(petSql, [name, type, sex])
        .then(result => {
            const ownersData = owners.map(item => [result.rows[0].id, item])
            const ownersSql = format('INSERT INTO pet_own (owner_id, pet_id) VALUES %L', ownersData)

            return pool.query(ownersSql)
        }).then(() => res.status(201).json(CREATED))
})

PetRouter.delete('/:id(\\d+)', authMandatory, (req, res) => {
    authOwnership(req.params.id, req.body.id)
        .then(result => {
            if (!result) res.status(403).json(FORBIDDEN)
            else {
                const sql = 'DELETE FROM pet WHERE id = $1'
                return pool.query(sql, [req.params.id])
            }
        }).then(() => res.status(204).send())
})  

PetRouter.patch('/:id(\\d+)', authMandatory, (req, res) => {
    authOwnership(req.params.id, req.body.id)
        .then(result => {
            if (!result) res.status(403).json(FORBIDDEN)
            else {
                const sql = generatePetEditQuery(PetEditValidator.parse(req.body), req.params.id)
                return pool.query(sql)
            }
        }).then(() => res.status(204).send())
})

PetRouter.get('/', (req, res) => {
    const sql = generatePetFetchQuery(PetFetchValidator.parse(req.query))

    pool.query(sql)
        .then(result => res.status(200).json(result))
})

PetRouter.get('/:id(\\d+)', async (req, res, next) => {
    try {
        const petSql = 'SELECT name, type_id, sex FROM pet WHERE id = $1'
        const petPromise = pool.query(petSql, [req.params.id])

        const ownersSql = 'SELECT owner_id FROM pet_own WHERE pet_id = $1'
        const ownersPromise = pool.query(ownersSql, [req.params.id])

        const petData = await petPromise
        const ownersData = await ownersPromise
        
        if (petData.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
        else res.status(200).json({ ...petData, owners: ownersData })
    } catch (err) { next(err) }
})

export { PetRouter }

