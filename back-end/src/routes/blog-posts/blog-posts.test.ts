import request from 'supertest'
import { app } from "../.."

describe('/blog-posts', () => {
    const credExisting = {
        password: 'ILoveDogs1234',
        email: 'dogs@gmail.com',
        accountName: 'dogfan',
    }

    
    const contents = 'Testing blog post'
    const pets = [1, 2]
    const tags = [1, 2]
    const pictures = [1, 2]

    const agent = request.agent(app)
    beforeAll(async () => await agent.post('/accounts/login/').send({ ...credExisting }).expect(204))

    describe('/ POST', () => {
        it('should fail without contents (400)', (done) => { agent.post('/blog-posts/').expect(400, done) })

        it('should require authorization (401)', (done) => { request(app).post('/blog-posts/').expect(401, done) })

        it('should fail with not owned pets (403)', () => 
            agent.post('/blog-posts/').send({ contents, pets: [1, 6, 7] }).expect(403).then(res => {
                expect(res.body).toStrictEqual([6, 7])
            })
        )

        it('should respond (201)', (done) => { agent.post('/blog-posts/').send({ contents }).expect(201, done) })

        it('should respond on failed linking (404)', (done) => {
            agent.post('/blog-posts/').send({ contents, tags: [999], pictures: [999] }).expect(404, done)
        })

        it('should add additional content', (done) => { agent.post('/blog-posts/').send({ contents, tags, pets, pictures }).expect(201, done) })
    })

    describe('/[id] DELETE', () => {
        it('should require authorization (401)', (done) => { request(app).delete('/blog-posts/17').expect(401, done) })

        it('should respond (204)', (done) => { agent.delete('/blog-posts/17').expect(204, done) })
    })

    describe('/ GET', () => {
        it('should return array of ids (200)', () => {
            return request(app).get('/blog-posts/').expect(200).then(res => {
                expect(
                    res.body instanceof Array 
                    && res.body.every(id => typeof id === 'number')
                ).toBeTruthy()
            })
        })
    })

    describe('/[id] GET', () => {
        it('should get pet if exists (200)', (done) => {
            request(app)
                .get('/blog-posts/1')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8', done)
        })

        it('should respond if blog-post doesn\'t exist (404)', (done) => { request(app).get('/blog-posts/999').expect(404, done) })

        describe('liked', () => {
            it('should be false without auth (200)', () => 
                request(app)
                    .get('/blog-posts/1')
                    .expect(200)
                    .expect(res => expect(res.body.liked).toBeFalsy())
            )

            it('should be false if not liked (200)', () => 
                agent
                    .get('/blog-posts/10')
                    .expect(200)
                    .expect(res => expect(res.body.liked).toBeFalsy())
            )

            it('should be true if liked (200)', () => 
                agent
                    .get('/blog-posts/1')
                    .expect(200)
                    .expect(res => expect(res.body.liked).toBeTruthy())
            )
        })
    })

    describe('/[id]/likes', () => {
        describe('/ POST', () => {
            it('should require authorization (401)', (done) => { request(app).post('/blog-posts/1/likes/').expect(401, done) })

            it('should respond (204)', (done) => { agent.post('/blog-posts/6/likes').expect(204, done) })

            it('should prevent double like (409)', (done) => { agent.post('/blog-posts/6/likes').expect(409, done) })

            it('should prevent non-existent like (404)', (done) => { agent.post('/blog-posts/999/likes').expect(404, done) })
        })

        describe('/ DELETE', () => {
            it('should require authorization (401)', (done) => { request(app).delete('/blog-posts/6/likes').expect(401, done) })

            it('should respond (204)', (done) => { agent.delete('/blog-posts/6/likes').expect(204, done) })
        })
    })

    describe('/tags', () => {
        describe('/ GET', () => {
            it('should return array of ids (200)', () => {
                return request(app).get('/blog-posts/tags').expect(200).then(res => {
                    expect(
                        res.body instanceof Array 
                        && res.body.every(id => typeof id === 'number')
                    ).toBeTruthy()
                })
            })
        })
    
        describe('/[id] GET', () => {
            it('should get tag if exists (200)', (done) => {
                request(app)
                    .get('/blog-posts/tags/1')
                    .expect(200)
                    .expect('Content-Type', 'application/json; charset=utf-8', done)
            })
    
            it('should respond if tag doesn\'t exist (404)', (done) => { request(app).get('/blog-pots/tags/999').expect(404, done) })
        })

        describe('/ POST', () => {
            it('should fail without name (400)', (done) => {
                agent.post('/blog-posts/tags').expect(400, done)
            })
    
            it('should require authorization (401)', (done) => { request(app).post('/blog-posts/tags').expect(401, done) })
    
            it('should fail on name conflict (409)', (done) => {
                agent.post('/blog-posts/tags').send({ name: 'Two' }).expect(409, done)
            })
    
            it('should respond on success (201)', (done) => {
                agent.post('/blog-posts/tags').send({ name: 'Test blog tag' }).expect(201, done)
            })
        })
    })
})