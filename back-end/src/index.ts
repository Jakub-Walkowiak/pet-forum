import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from './helpers/status-codes'
import { AccountRouter } from './routers/account-router'

const corsOptions = {
    origin: ['http://localhost'],
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/accounts', AccountRouter)

app.all('*', (req, res) => {
    res.status(404).json(NOT_FOUND)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof z.ZodError) {
        console.error(`Data error: ${err}`)
        res.status(400).json(BAD_REQUEST)
    } else next(err)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`Encountered error: ${err}`)
    res.status(500).json(INTERNAL_SERVER_ERROR)
})

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`)
})