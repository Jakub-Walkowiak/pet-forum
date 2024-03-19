import { Request, Router } from 'express'
import multer from 'multer'
import path from 'path'
import format from 'pg-format'
import { pool } from '../../helpers/pg-pool'
import { BAD_REQUEST, RESOURCE_NOT_FOUND } from '../../helpers/status-codes'

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'imgs/')
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.webp'
        cb(null, fileName)
    }
})

const upload = multer({ storage })

const ImageRouter = Router()

ImageRouter.post('/', upload.array('images', 10), (req, res) => {
    if (req.files === undefined || req.files.length === 0) res.status(400).send(BAD_REQUEST)
    else {
        const sql = format('INSERT INTO picture (picture_path) VALUES %L RETURNING id', (<Express.Multer.File[]>req.files).map(file => [file.filename.slice(0, -5)]))

        pool.query(sql)
            .then(result => res.status(201).send(result.rows))
    }
})

ImageRouter.get('/:id(\\d+)', (req, res) => {
    const sql = 'SELECT picture_path AS "picturePath" FROM picture WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).sendFile(path.resolve('imgs/' + result.rows[0].picturePath + '.webp'))
        })
})

export { ImageRouter }

