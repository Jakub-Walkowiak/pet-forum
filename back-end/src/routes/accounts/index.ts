import bcrypt from 'bcrypt'
import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { generateAccountEditQuery } from '../../helpers/query-generators/accounts/generate-account-edit-query'
import generateRelationTypeJoin from '../../helpers/query-generators/accounts/generate-relation-type-join'
import { CONFLICT, CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { AccountOrderByOption, RelationType } from '../../types/account-types'
import { AccountEditValidator, AccountFetchValidator, AddProfilePictureValidator, ChangePasswordValidator, LoginValidator, RegistrationValidator } from '../../validators/account-validators'
import { FollowRouter } from './follows'
import { attemptLogin } from './functions'

const saltRounds = 10
const AccountRouter = Router()

AccountRouter.use('/:id(\\d+)/follow', FollowRouter)

AccountRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password, accountName } = RegistrationValidator.parse(req.body)

        const registerSql = 'INSERT INTO user_account (email, password, account_name, display_name) VALUES ($1, $2, $3, $4)'

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        pool.query(registerSql, [email, hashedPassword, accountName, accountName])
            .then(() => res.status(201).json(CREATED))
            .catch(async err => {
                if (err.code === '23505') {
                    const accountNameDupeSql = 'SELECT COUNT(*) AS dupe FROM user_account WHERE account_name = $1'
                    const emailDupeSql = 'SELECT COUNT(*) AS dupe FROM user_account WHERE email = $1'

                    const accountNameDupe = (await pool.query(accountNameDupeSql, [accountName])).rows[0].dupe !== 0
                    const emailDupe = (await pool.query(emailDupeSql, [email])).rows[0].dupe !== 0

                    res.status(409).json({ accountNameDupe, emailDupe })
                } else next(err)
            })
    } catch (err) { next(err) }
})

AccountRouter.post('/login', async (req, res, next) => {
    try {
        const { email, accountName, password } = LoginValidator.parse(req.body)
    
        if (email) {
            const sql = 'SELECT password, account_name, id FROM user_account WHERE email = $1'
            await attemptLogin(sql, email, password, res)
        } else if (accountName) {
            const sql = 'SELECT password, account_name, id FROM user_account WHERE account_name = $1'
            await attemptLogin(sql, accountName, password, res)
        }
    } catch(err) { next(err) }
})

AccountRouter.delete('/', authMandatory, (req, res, next) => {
    const sql = 'DELETE FROM user_account WHERE id = $1'

    pool.query(sql, [req.body.id])
        .then(() => res.status(204).send())
        .catch(err => next(err))
})

AccountRouter.patch('/', authMandatory, (req, res, next) => {
    const sql = generateAccountEditQuery(AccountEditValidator.parse(req.body), req.body.id)
    
    if (sql !== '') {
        pool.query(sql)
            .then(() => res.status(204).send())
            .catch(err => {
                if (err.code === '23505') res.status(409).json(CONFLICT)
                else if (err.code === '23503') res.status(404).json(RESOURCE_NOT_FOUND)
                else next(err)
            })
    } else res.status(204).send()
})

AccountRouter.patch('/password', authMandatory, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = ChangePasswordValidator.parse(req.body)
        const getSql = 'SELECT password FROM user_account WHERE id = $1'

        const result = await pool.query(getSql, [req.body.id])
        const verified = await bcrypt.compare(currentPassword, result.rows[0].password)

        if (verified) {
            const changeSql = 'UPDATE user_account SET password = $1 WHERE id = $2'
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
            pool.query(changeSql, [hashedPassword, req.body.id])
                .then(() => res.status(204).send())
        } else { res.status(403).json(FORBIDDEN) }
    } catch (err) { next(err) }
})

AccountRouter.get('/', authOptional, async (req, res, next) => {
    try {
        const { contains, limit, offset, orderBy, orderMode, relatedTo, relationType } = AccountFetchValidator.parse(req.query)
    
        if (relationType === RelationType.FOLLOWED || relationType === RelationType.MUTUALS) {
            const privacySql = 'SELECT followed_visible FROM user_account WHERE id = $1'
            const shouldFetch = (req.body.auth && req.body.id === relatedTo) || (await pool.query(privacySql, [relatedTo])).rows[0].followed_visible
            if (!shouldFetch) res.status(403).json(FORBIDDEN)
        }

        const nameQueryString = contains === undefined ? '' : `--sql
            WHERE Lower(account_name) LIKE Lower(\'%${contains}%\')
            OR Lower(display_name) LIKE Lower(\'%${contains}%\')`

        const orderByString = orderBy !== AccountOrderByOption.DATE_FOLLOWED 
            ? `${orderBy}`
            : relatedTo === undefined ? AccountOrderByOption.FOLLOWERS
                : relationType === RelationType.FOLLOWERS ? 'followers.date_followed'
                : relationType === RelationType.FOLLOWED ? 'followed.date_followed'
                : 'Greatest(followers.date_followed, followed.date_followed)'

        const sql = `--sql
            SELECT id FROM user_account ${generateRelationTypeJoin(relationType, relatedTo)}
            ${nameQueryString}
            ORDER BY 
                ${req.body.auth ? `id = ${req.body.id},` : ''} 
                ${orderByString} ${orderMode}
            LIMIT ${limit} OFFSET ${offset}`

        pool.query(sql)
            .then(result => res.status(200).json(result.rows))
            .catch(err => next(err))
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)', authOptional, async (req, res, next) => {
    try {
        const sql = `--sql
        SELECT account_name AS "accountName",
               display_name AS "displayName",
               follower_count AS "followerCount",
               followed_count AS "followedCount",
               date_created AS "dateCreated",
               running_response_score AS "runningResponseScore",
               net_positive_responses AS "netPositiveResponses",
               net_negative_responses AS "netNegativeResponses",
               best_responses AS "bestResponses",
               blog_post_count as "blogPostCount",
               reply_count AS "replyCount",
               advice_count AS "adviceCount",
               response_count AS "responseCount",
               owned_pet_count AS "ownedPetCount",
               profile_picture_id AS "profilePictureId",
               bio,
               likes_visible AS "likesVisible"
        FROM user_account
        WHERE id = $1`

        let followed = false
        if (req.body.auth === true) {
            const followedSql = 'SELECT Count(*) AS count FROM follow WHERE follower_id = $1 AND followed_id = $2'
            if ((await pool.query(followedSql, [req.body.id, req.params.id])).rows[0].count > 0) followed = true
        }

        pool.query(sql, [req.params.id])
            .then(result => {
                if (result.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
                else res.status(200).json({ ...result.rows[0], followed })
            }).catch(err => next(err))
    } catch (err) { next(err) }
})

AccountRouter.post('/:id(\\d+)/pfp', authMandatory, (req, res, next) => {
    const { pictureId } = AddProfilePictureValidator.parse(req.body)

    const sql = 'INSERT INTO profile_picture (user_account_id, picture_id) VALUES ($1, $2)'

    pool.query(sql, [req.params.id, pictureId])
        .then(() => res.status(201).json(CREATED))
        .catch(err => next(err))
})

export { AccountRouter }

