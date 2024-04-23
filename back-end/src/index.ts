import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'
import { z } from 'zod'
import { BAD_REQUEST, ENDPOINT_NOT_FOUND, INTERNAL_SERVER_ERROR } from './helpers/status-codes'
import { AccountRouter } from './routes/accounts'
import { BlogPostRouter } from './routes/blog-posts'
import { ImageRouter } from './routes/images'
import { PetRouter } from './routes/pets'

const corsOptions = {
    origin: ['http://localhost:8080'],
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
}

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/accounts', AccountRouter)
app.use('/blog-posts', BlogPostRouter)
app.use('/images', ImageRouter)
app.use('/pets', PetRouter)

app.all('*', (req, res) => {
    res.status(404).json(ENDPOINT_NOT_FOUND)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof z.ZodError) {
        console.error(`${err}`)
        res.status(400).json(BAD_REQUEST)
    } else next(err)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MulterError) {
        console.error(`${err.stack}`)
        res.status(400).json(BAD_REQUEST)
    } else next(err)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`${err.stack}`)
    res.status(500).json(INTERNAL_SERVER_ERROR)
})

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`)
})