import path from 'path'
import request from 'supertest'
import { app } from '../..'

describe('/images', () => {
    describe('/ POST', () => {
        describe('validation', () => {
            it('should require at least one image (400)', (done) => {
                request(app)
                    .post('/images')
                    .expect(400, done)
            })

            it('should not accept more than 10 images (400)', (done) => {
                request(app)
                    .post('/images')
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .attach('images', path.join(__dirname, '/../../../testing.png'))
                    .expect(400, done)
            })
        })

        it('should upload one image', (done) => {
            request(app)
                .post('/images')
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .expect(201, done);
        })

        it('should upload ten images', (done) => {
            request(app)
                .post('/images')
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .attach('images', path.join(__dirname, '/../../../testing.png'))
                .expect(201, done);
        })
    })
})