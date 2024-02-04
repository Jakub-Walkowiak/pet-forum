import express, { Express, Request, Response } from 'express'
import 'dotenv/config'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`)
})