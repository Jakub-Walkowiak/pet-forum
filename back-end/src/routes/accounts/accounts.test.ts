import request from 'supertest'
import { z } from 'zod'
import { app } from '../..'

describe('/accounts', () => {
    const credExisting = {
        password: 'ILoveDogs1234',
        email: 'dogs@gmail.com',
        accountName: 'dogfan',
    }

    const agent = request.agent(app)
    beforeAll(async () => await agent.post('/accounts/login/').send({ ...credExisting }).expect(204))

    describe('/register POST', () => {
        const credTest = {
            password: 'register_password',
            email: 'register@email.com',
            accountName: 'register',
        }

        describe('validation', () => {
            it('should require password (400)', (done) => {
                request(app)
                    .post('/accounts/register/')
                    .send({ ...credTest, password: undefined })
                    .expect(400, done)
            })

            it('should require email (400)', (done) => {
                request(app)
                    .post('/accounts/register/')
                    .send({ ...credTest, email: undefined })
                    .expect(400, done)
            })

            it('should require account name (400)', (done) => {
                request(app)
                    .post('/accounts/register/')
                    .send({ ...credTest, accountName: undefined })
                    .expect(400, done)
            })
        })

        describe('should prevent dupes and return info', () => {
            it('for emails (409)', (done) => {
                request(app)
                    .post('/accounts/register/')
                    .send({ ...credTest, email: credExisting.email })
                    .expect(409)
                    .expect({ emailDupe: true, accountNameDupe: false }, done)
            })

            it('for account names (409)', (done) => {
                request(app)
                    .post('/accounts/register/')
                    .send({ ...credTest, accountName: credExisting.accountName })
                    .expect(409)
                    .expect({ emailDupe: false, accountNameDupe: true }, done)
            })

            it('for both at once (409)', (done) => {
                request(app)
                    .post('/accounts/register/')
                    .send({ ...credTest, accountName: credExisting.accountName, email: credExisting.email })
                    .expect(409)
                    .expect({ emailDupe: true, accountNameDupe: true }, done)
            })
        })

        it('should register (201)', (done) => {
            request(app)
                .post('/accounts/register/')
                .send({ ...credTest })
                .expect(201, done)
        })
    })

    describe('/login POST', () => {
        const credTest = {
            password: 'login_password',
            email: 'login@email.com',
            accountName: 'login',
        }

        describe('validation', () => {
            it('should require email or account name (400)', (done) => {
                request(app)
                    .post('/accounts/login/')
                    .send({ password: credExisting.password })
                    .expect(400, done)
            })
        })

        describe('should login', () => {
            it('with just email (204)', () => {
                return request(app)
                    .post('/accounts/login/')
                    .send({ ...credExisting, accountName: undefined })
                    .expect(204)
                    .then((res) => expect(res.headers['set-cookie']).toBeTruthy())
            })

            it('with just account name (204)', () => {
                return request(app)
                    .post('/accounts/login/')
                    .send({ ...credExisting, email: undefined })
                    .expect(204)
                    .then((res) => expect(res.headers['set-cookie']).toBeTruthy())
            })

            it('with both (204)', () => {
                return request(app)
                    .post('/accounts/login/')
                    .send({ ...credExisting })
                    .expect(204)
                    .then((res) => expect(res.headers['set-cookie']).toBeTruthy())
            })
        })

        it('should require correct password (401)', (done) => {
            request(app)
                .post('/accounts/login/')
                .send({ ...credExisting, password: credTest.password })
                .expect(401, done)
        })

        it('should fail on nonexistent account (404)', (done) => {
            request(app)
                .post('/accounts/login/')
                .send({ ...credTest })
                .expect(404, done)
        })
    })

    describe('/ DELETE ', () => {
        it('should require authorization (401)', (done) => {
            request(app).delete('/accounts/').expect(401, done)
        })

        it('should respond when authorized (204)', async () => {
            const credTest = {
                password: 'delete_password',
                email: 'delete@email.com',
                accountName: 'delete',
            }
            
            const agent = request.agent(app)
    
            await agent
                .post('/accounts/register/')
                .send({ ...credTest })
                .expect(201)

            await agent
                .post('/accounts/login/')
                .send({ ...credTest })
                .expect(204)
    
            await agent
                .delete('/accounts/')
                .expect(204)
        })
    })

    describe('/ PATCH', () => {
        const credTest = {
            password: 'patch_password',
            email: 'patch@email.com',
            accountName: 'patch',
        }

        const agent = request.agent(app)

        beforeAll(async () => {
            await agent.post('/accounts/register/').send({ ...credTest }).expect(201)
            await agent.post('/accounts/login/').send({ ...credTest }).expect(204)
        })

        it('should require authorization (401)', (done) => { request(app).patch('/accounts/').send({}).expect(401, done) })

        it('should respond for empty body (204)', (done) => { agent.patch('/accounts/').send({}).expect(204, done) })

        it('should respond with data (204)', (done) => { 
            const data = {
                accountName: 'patch_new',
                displayName: 'patch_display_new',
                email: 'patch_new@email.com',
                followedVisible: false,
                likesVisible: false,
            }

            agent.patch('/accounts/').send({ ...data }).expect(204, done) 
        })

        describe('should prevent dupes and return info', () => {
            it('for emails (409)', (done) => {
                agent
                    .patch('/accounts/')
                    .send({ email: credExisting.email })
                    .expect(409)
                    .expect({ emailDupe: true, accountNameDupe: false }, done)
            })

            it('for account names (409)', (done) => {
                agent
                    .patch('/accounts/')
                    .send({ accountName: credExisting.accountName })
                    .expect(409)
                    .expect({ emailDupe: false, accountNameDupe: true }, done)
            })

            it('for both at once (409)', (done) => {
                agent
                    .patch('/accounts/')
                    .send({ accountName: credExisting.accountName, email: credExisting.email })
                    .expect(409)
                    .expect({ emailDupe: true, accountNameDupe: true }, done)
            })
        })

        it('should prevent linking non-existent image (404)', (done) => { agent.patch('/accounts/').send({ profilePictureId: 999 }).expect(404, done) })
    })

    describe('/password PATCH', () => {
        const credTest = {
            password: 'password_patch_password',
            email: 'password_patch@email.com',
            accountName: 'password_patch',
        }
        const newPassword = 'password_patch_password_new'

        const agent = request.agent(app)

        beforeAll(async () => {
            await agent.post('/accounts/register/').send({ ...credTest }).expect(201)
            await agent.post('/accounts/login/').send({ ...credTest }).expect(204)
        })

        it('should require authorization (401)', (done) => { request(app).patch('/accounts/password/').send({}).expect(401, done) })

        describe('validation', () => {
            it('should require current password (400)', (done) => { 
                agent
                    .patch('/accounts/password')
                    .send({ newPassword })
                    .expect(400, done)
            })

            it('should require new password (400)', (done) => { 
                agent
                    .patch('/accounts/password')
                    .send({ currentPassword: credTest.password })
                    .expect(400, done)
            })
        })

        it('should require correct password (403)', (done) => {
            agent
                .patch('/accounts/password')
                .send({ currentPassword: newPassword, newPassword })
                .expect(403, done)
        })

        it('should respond on success (204)', (done) => {
            agent
                .patch('/accounts/password')
                .send({ currentPassword: credTest.password, newPassword })
                .expect(204, done)
        })
    })

    describe('/ GET', () => {
        it('should return array of ids (200)', () => {
            return request(app).get('/accounts/').expect(200).then(res => {
                expect(
                    res.body instanceof Array 
                    && res.body.every(id => typeof id === 'number')
                ).toBeTruthy()
            })
        })
    })

    describe('/[id] GET', () => {
        it('should get account if exists (200)', (done) => {
            request(app)
                .get('/accounts/1')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8', done)
        })

        it('should respond if account doesn\'t exist (404)', (done) => { request(app).get('/accounts/999').expect(404, done) })

        describe('followed', () => {
            it('should be false without auth (200)', () => 
                request(app)
                    .get('/accounts/1')
                    .expect(200)
                    .expect(res => expect(res.body.followed).toBeFalsy())
            )

            it('should be false if not followed (200)', () => 
                agent
                    .get('/accounts/1')
                    .expect(200)
                    .expect(res => expect(res.body.followed).toBeFalsy())
            )

            it('should be true if followed (200)', () => 
                agent
                    .get('/accounts/2')
                    .expect(200)
                    .expect(res => expect(res.body.followed).toBeTruthy())
            )
        })
    })

    describe('/email GET', () => {
        it('should require authorization (401)', (done) => { request(app).get('/accounts/email').expect(401, done) })

        it('should return an email when authorized (200)', () => 
            agent
                .get('/accounts/email')
                .expect(200)
                .expect(res => 
                    expect(() => z.string().email().parse(res.body)).not.toThrow()
                ) 
        )
    })

    describe('/[id]/follow', () => {
        describe('/ POST', () => {
            it('should require authorization (401)', (done) => { request(app).post('/accounts/1/follow/').expect(401, done) })

            it('should respond (204)', (done) => { agent.post('/accounts/4/follow').expect(204, done) })

            it('should prevent double follow (409)', (done) => { agent.post('/accounts/4/follow').expect(409, done) })

            it('should prevent non-existent follow (404)', (done) => { agent.post('/accounts/999/follow').expect(404, done) })

            it('should prevent self-follow (403)', (done) => { agent.post('/accounts/1/follow').expect(403, done) })
        })

        describe('/ DELETE', () => {
            it('should require authorization (401)', (done) => { request(app).delete('/accounts/1/follow/').expect(401, done) })

            it('should respond (204)', (done) => { agent.delete('/accounts/4/follow').expect(204, done) })
        })
    })
})