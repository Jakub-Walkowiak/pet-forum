import request from 'supertest'
import { app } from '../..'

describe('/pets', () => {
    const credExisting = {
        password: 'ILoveDogs1234',
        email: 'dogs@gmail.com',
        accountName: 'dogfan',
    }

    const pet = {
        name: 'testing_pet',
        owners: [1],
        sex: 'm',
        type: 1,
        profilePictureId: 1,
    }

    const agent = request.agent(app)
    beforeAll(
        async () =>
            await agent
                .post('/accounts/login/')
                .send({ ...credExisting })
                .expect(204),
    )

    describe('/ POST', () => {
        describe('validation', () => {
            it('should fail without name (400)', (done) => {
                agent
                    .post('/pets/')
                    .send({ ...pet, name: undefined })
                    .expect(400, done)
            })

            it('should fail without owners (400)', (done) => {
                agent
                    .post('/pets/')
                    .send({ ...pet, owners: undefined })
                    .expect(400, done)
            })

            it('should fail without type (400)', (done) => {
                agent
                    .post('/pets/')
                    .send({ ...pet, type: undefined })
                    .expect(400, done)
            })
        })

        it('should require authorization (401)', (done) => {
            request(app).post('/pets/').expect(401, done)
        })

        it('should fail with invalid pfp (404)', (done) => {
            agent
                .post('/pets/')
                .send({ ...pet, profilePictureId: 999 })
                .expect(404, done)
        })

        it('should fail on name conflict (409)', (done) => {
            agent
                .post('/pets/')
                .send({ ...pet, name: 'Lemmy' })
                .expect(409, done)
        })

        it('should respond on success (201)', (done) => {
            agent
                .post('/pets/')
                .send({ ...pet })
                .expect(201, done)
        })
    })

    describe('/[id] PATCH', () => {
        it('should require authorization (401)', (done) => {
            request(app).patch('/pets/1').expect(401, done)
        })

        it('should require ownership (403)', (done) => {
            agent.patch('/pets/7').expect(403, done)
        })

        it('should respond (204)', (done) => {
            agent.patch('/pets/10').send({ name: 'testing_pet_new' }).expect(204, done)
        })

        it('should fail on name conflict (409)', (done) => {
            agent.patch('/pets/10').send({ name: 'Lemmy' }).expect(409, done)
        })
    })

    describe('/[id] DELETE', () => {
        it('should require authorization (401)', (done) => {
            request(app).delete('/pets/1').expect(401, done)
        })

        it('should require ownership (403)', (done) => {
            agent.delete('/pets/7').expect(403, done)
        })

        it('should respond (204)', (done) => {
            agent.delete('/pets/10').expect(204, done)
        })
    })

    describe('/ GET', () => {
        it('should return array of ids (200)', () => {
            return request(app)
                .get('/pets/')
                .expect(200)
                .then((res) => {
                    expect(res.body instanceof Array && res.body.every((id) => typeof id === 'number')).toBeTruthy()
                })
        })
    })

    describe('/[id] GET', () => {
        it('should get pet if exists (200)', (done) => {
            request(app).get('/pets/1').expect(200).expect('Content-Type', 'application/json; charset=utf-8', done)
        })

        it("should respond if pet doesn't exist (404)", (done) => {
            request(app).get('/pets/999').expect(404, done)
        })

        describe('followed', () => {
            it('should be false without auth (200)', () =>
                request(app)
                    .get('/pets/1')
                    .expect(200)
                    .expect((res) => expect(res.body.followed).toBeFalsy()))

            it('should be false if not followed (200)', () =>
                agent
                    .get('/pets/4')
                    .expect(200)
                    .expect((res) => expect(res.body.followed).toBeFalsy()))

            it('should be true if followed (200)', () =>
                agent
                    .get('/pets/1')
                    .expect(200)
                    .expect((res) => expect(res.body.followed).toBeTruthy()))
        })

        describe('owned', () => {
            it('should be false without auth (200)', () =>
                request(app)
                    .get('/pets/1')
                    .expect(200)
                    .expect((res) => expect(res.body.owned).toBeFalsy()))

            it('should be false if not owned (200)', () =>
                agent
                    .get('/pets/4')
                    .expect(200)
                    .expect((res) => expect(res.body.owned).toBeFalsy()))

            it('should be true if owned (200)', () =>
                agent
                    .get('/pets/1')
                    .expect(200)
                    .expect((res) => expect(res.body.owned).toBeTruthy()))
        })
    })

    describe('/[id]/follow', () => {
        describe('/ POST', () => {
            it('should require authorization (401)', (done) => {
                request(app).post('/pets/1/follow/').expect(401, done)
            })

            it('should respond (204)', (done) => {
                agent.post('/pets/4/follow').expect(204, done)
            })

            it('should prevent double follow (409)', (done) => {
                agent.post('/pets/4/follow').expect(409, done)
            })

            it('should prevent non-existent follow (404)', (done) => {
                agent.post('/pets/999/follow').expect(404, done)
            })
        })

        describe('/ DELETE', () => {
            it('should require authorization (401)', (done) => {
                request(app).delete('/pets/1/follow/').expect(401, done)
            })

            it('should respond (204)', (done) => {
                agent.delete('/pets/4/follow').expect(204, done)
            })
        })
    })

    describe('/[id]/owners', () => {
        describe('/ POST', () => {
            it('should require authorization (401)', (done) => {
                request(app).post('/pets/1/owners/').expect(401, done)
            })

            it('should require ownership (403)', (done) => {
                agent.post('/pets/7/owners/').expect(403, done)
            })

            it('should require an owner to be provided (400)', (done) => {
                agent.post('/pets/1/owners/').expect(400, done)
            })

            it('should respond (201)', (done) => {
                agent.post('/pets/1/owners').send({ user: 3 }).expect(201, done)
            })

            it('should prevent double own (409)', (done) => {
                agent.post('/pets/1/owners').send({ user: 3 }).expect(409, done)
            })

            it('should prevent non-existent owner (404)', (done) => {
                agent.post('/pets/1/owners').send({ user: 999 }).expect(404, done)
            })
        })

        describe('/rescind DELETE', () => {
            it('should require authorization (401)', (done) => {
                request(app).delete('/pets/1/owners/rescind').expect(401, done)
            })

            it('should require ownership (403)', (done) => {
                agent.delete('/pets/7/owners/rescind').expect(403, done)
            })

            it('should respond (204)', (done) => {
                agent.delete('/pets/1/owners/rescind').expect(204, done)
            })
        })
    })

    describe('/types', () => {
        describe('/ GET', () => {
            it('should return array of ids (200)', () => {
                return request(app)
                    .get('/pets/types')
                    .expect(200)
                    .then((res) => {
                        expect(res.body instanceof Array && res.body.every((id) => typeof id === 'number')).toBeTruthy()
                    })
            })
        })

        describe('/[id] GET', () => {
            it('should get type if exists (200)', (done) => {
                request(app)
                    .get('/pets/types/1')
                    .expect(200)
                    .expect('Content-Type', 'application/json; charset=utf-8', done)
            })

            it("should respond if type doesn't exist (404)", (done) => {
                request(app).get('/pets/types/999').expect(404, done)
            })
        })

        describe('/ POST', () => {
            it('should fail without name (400)', (done) => {
                agent.post('/pets/types').expect(400, done)
            })

            it('should require authorization (401)', (done) => {
                request(app).post('/pets/types').expect(401, done)
            })

            it('should fail on name conflict (409)', (done) => {
                agent.post('/pets/types').send({ name: 'Dog' }).expect(409, done)
            })

            it('should respond on success (201)', (done) => {
                agent.post('/pets/types').send({ name: 'Test pet type' }).expect(201, done)
            })
        })
    })
})
