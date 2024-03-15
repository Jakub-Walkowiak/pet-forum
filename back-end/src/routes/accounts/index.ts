import bcrypt from 'bcrypt'
import { Router } from 'express'
import { pool } from '../../helpers/pg-pool'
import { generateAccountEditQuery } from '../../helpers/query-generators/generate-account-edit-query'
import { CONFLICT, CREATED, FORBIDDEN, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'
import { authMandatory, authOptional } from '../../middleware/auth'
import { AccountEditValidator, AccountFetchValidator, AccountFollowFetchData, AccountFollowFetchValidator, AddProfilePictureValidator, ChangePasswordValidator, LoginValidator, RegistrationValidator } from '../../validators/account-validators'
import { FollowRouter } from './follows'
import { attemptLogin, getFollowed, getFollowers } from './functions'

const saltRounds = 10
const AccountRouter = Router()

AccountRouter.use('/id(\\d+)/follow', FollowRouter)

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

AccountRouter.post('/login', (req, res, next) => {
    try {
        const { email, accountName, password } = LoginValidator.parse(req.body)
    
        if (email) {
            const sql = 'SELECT password, account_name, id FROM user_account WHERE email = $1'
            attemptLogin(sql, email, password, res)
        } else if (accountName) {
            const sql = 'SELECT password, account_name FROM user_account WHERE account_name = $1'
            attemptLogin(sql, accountName, password, res)
        }
    } catch(err) { next(err) }
})

AccountRouter.delete('/', authMandatory, (req, res) => {
    const sql = 'DELETE FROM user_account WHERE id = $1'

    pool.query(sql, [req.body.id])
        .then(() => res.status(204).send())
})

AccountRouter.patch('/', authMandatory, (req, res, next) => {
    const sql = generateAccountEditQuery(AccountEditValidator.parse(req.body), req.body.id)
    
    if (sql !== '') {
        pool.query(sql)
            .then(() => res.status(204).send())
            .catch(err => {
                if (err.code === '23505') res.status(409).json(CONFLICT)
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

AccountRouter.get('/', (req, res) => {
    const { nameQuery, limit, offset, orderBy, orderMode } = AccountFetchValidator.parse(req.body)

    const nameQueryString = nameQuery === undefined ? '' : `--sql
        WHERE Lower(account_name) LIKE Lower(\'%${nameQuery}%\')
        OR Lower(display_name) LIKE Lower(\'%${nameQuery}%\')`

    const sql = `--sql
        SELECT id FROM user_account
        ${nameQueryString}
        ORDER BY ${orderBy} ${orderMode}
        LIMIT ${limit} OFFSET ${offset}`

    pool.query(sql)
        .then(result => res.status(200).json(result))
})

AccountRouter.get('/:id(\\d+)', (req, res) => {
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
               profile_picture AS "profilePicture"
        FROM user_account
        WHERE id = $1`

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result.rows[0])
        })
})

AccountRouter.get('/:id(\\d+)/followed', authOptional, async (req, res, next) => {
    try {
        const privacySql = 'SELECT followed_visible FROM user_account WHERE id = $1'
        const shouldFetch = (req.body.auth && req.body.id === req.params.id) || (await pool.query(privacySql, [req.params.id])).rows[0].followed_visible

        if (shouldFetch) {
            const data: AccountFollowFetchData = AccountFollowFetchValidator.parse(req.body)

            const result = await getFollowed(req.params.id, data)
            if (result.length === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result)
        } else res.status(403).json(FORBIDDEN)
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)/followers', authOptional, async (req, res, next) => {
    try {
        const data: AccountFollowFetchData = AccountFollowFetchValidator.parse(req.body)

        let result

        if (req.body.auth) result = await getFollowers(req.params.id, req.body.id, data)
        else result = await getFollowers(req.params.id, undefined, data)

        if (result.length === 0) res.status(404).send(RESOURCE_NOT_FOUND)
        else res.status(200).json(result)
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)/mutuals', authOptional, async (req, res, next) => {
    try {
        const privacySql = 'SELECT followed_visible FROM user_account WHERE id = $1'
        const shouldFetch = (req.body.auth && req.body.id === req.params.id) || (await pool.query(privacySql, [req.params.id])).rows[0].followed_visible

        if (shouldFetch) {
            const data: AccountFollowFetchData = AccountFollowFetchValidator.parse(req.body)

            const followed = await getFollowed(req.params.id, data)
            const followers = req.body.auth
                ? await getFollowers(req.params.id, req.body.id, data)
                : await getFollowers(req.params.id, undefined, data)

            const result = followed.filter(value => followers.includes(value))
            if (result.length === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).json(result)
        } else res.status(403).json(FORBIDDEN)
    } catch (err) { next(err) }
})

AccountRouter.get('/:id(\\d+)/likes', authOptional, async (req, res, next) => {
    try {
        if (!req.body.auth) {
            const verifyPrivacySql = 'SELECT likes_visible FROM user_account WHERE id = $1'
            if (!(await pool.query(verifyPrivacySql, [req.params.id])).rows[0].likes_visible) res.status(403).send(FORBIDDEN)
        }

        const fetchSql = 'SELECT post_id AS id FROM post_like WHERE user_account_id = $1'

        pool.query(fetchSql, [req.params.id])
            .then(result => res.status(200).send(result.rows))
    } catch (err) { next(err) }
})

AccountRouter.post('/:id(\\d+)/pfp', authMandatory, (req, res) => {
    const { pictureId } = AddProfilePictureValidator.parse(req.body)

    const sql = 'INSERT INTO profile_picture (user_account_id, picture_id) VALUES ($1, $2)'

    pool.query(sql, [req.params.id, pictureId])
        .then(() => res.status(201).json(CREATED))
})

export { AccountRouter }

