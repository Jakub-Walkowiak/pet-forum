import { Router } from 'express'
import format from 'pg-format'
import { pool } from '../../helpers/pg-pool'
import { generatePetEditQuery } from '../../helpers/query-generators/pets/generate-pet-edit-query'
import { generatePetFetchQuery } from '../../helpers/query-generators/pets/generate-pet-fetch-query'
import { CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { PetAddValidator, PetEditValidator, PetFetchValidator } from '../../validators/pet-validators'
import { FollowRouter } from './follows'
import { authOwnership } from './owner-auth'
import { OwnerRouter } from './owners'
import { TypeRouter } from './types'

const PetRouter = Router()

PetRouter.use('/:pet_id(\\d+)/owners', OwnerRouter)
PetRouter.use('/:pet_id(\\d+)/follow', FollowRouter)
PetRouter.use('/types', TypeRouter)

PetRouter.post('/', authMandatory, (req, res, next) => {
    const { name, owners, sex, type, profilePictureId } = PetAddValidator.parse(req.body)

    const petSql = 'INSERT INTO pet (name, type_id, sex, profile_picture_id) VALUES ($1, $2, $3, $4) RETURNING id'

    pool.query(petSql, [name, type, sex, profilePictureId])
        .then(result => {
            const ownersData = owners.map(item => [item, result.rows[0].id])
            const ownersSql = format('INSERT INTO pet_own (owner_id, pet_id) VALUES %L', ownersData)

            return pool.query(ownersSql)
        }).then(() => res.status(201).json(CREATED))
        .catch(async err => {
            if (err.code === '23505') res.status(409).send()
            else if (err.code === '23503') res.status(404).json(RESOURCE_NOT_FOUND)
            else next(err)
        })
})

PetRouter.delete('/:id(\\d+)', authMandatory, (req, res, next) => {
    authOwnership(req.params.id, req.body.id)
        .then(result => {
            if (!result) res.status(403).json(FORBIDDEN)
            else {
                const sql = 'DELETE FROM pet WHERE id = $1'
                return pool.query(sql, [req.params.id])
            }
        }).then(() => res.status(204).send())
        .catch(err => next(err))
})  

PetRouter.patch('/:id(\\d+)', authMandatory, (req, res, next) => {
    authOwnership(req.params.id, req.body.id)
        .then(result => {
            if (!result) res.status(403).json(FORBIDDEN)
            else {
                const sql = generatePetEditQuery(PetEditValidator.parse(req.body), req.params.id)
                console.log(sql)
                return pool.query(sql)
            }
        }).then(() => res.status(204).send())
        .catch(err => next(err))
})

PetRouter.get('/', (req, res, next) => {
    const sql = generatePetFetchQuery(PetFetchValidator.parse(req.query))

    pool.query(sql)
        .then(result => res.status(200).json(result.rows.map(row => row.id)))
        .catch(err => next(err))
})

PetRouter.get('/:id(\\d+)', authOptional, async (req, res, next) => {
    try {
        const petSql = `--sql
            SELECT 
                name, 
                type_id AS "typeId", 
                sex, profile_picture_id AS "profilePictureId", 
                follower_count AS "followerCount", 
                feature_count AS "featureCount",
                date_created AS "dateCreated"
            FROM pet WHERE id = $1`
        const petPromise = pool.query(petSql, [req.params.id])

        const ownersSql = 'SELECT owner_id AS id FROM pet_own WHERE pet_id = $1'
        const ownersPromise = pool.query(ownersSql, [req.params.id])

        const petData = await petPromise
        const owners = (await ownersPromise).rows.map(row => row.id)
        const owned = req.body.auth && owners.includes(req.body.id)

        let followed = false
        if (req.body.auth === true) {
            const followedSql = 'SELECT Count(*) AS count FROM pet_follow WHERE follower_id = $1 AND pet_id = $2'
            if ((await pool.query(followedSql, [req.body.id, req.params.id])).rows[0].count > 0) followed = true
        }
        
        if (petData.rowCount === 0) res.status(404).json(RESOURCE_NOT_FOUND)
        else res.status(200).json({ ...petData.rows[0], owners, owned, followed })
    } catch (err) { next(err) }
})

export { PetRouter }

