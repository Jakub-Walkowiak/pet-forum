import { Request, Router } from "express"
import multer from "multer"
import { pool } from "../../helpers/pg-pool"
import { CREATED, RESOURCE_NOT_FOUND } from "../../helpers/status-codes"

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, '../../../imgs')
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, fileName)
    }
})

const upload = multer({ storage })

const ImageRouter = Router()

ImageRouter.post('/', upload.single('image'), (req, res) => {
    const sql = 'INSERT INTO picture (picure_path) VALUES ($1)'

    pool.query(sql, [req.file?.filename])
        .then(() => res.status(201).send(CREATED))
})

ImageRouter.get('/:id(\\d+)', (req, res) => {
    const sql = 'SELECT picture_path FROM picture WHERE id = $1'

    pool.query(sql, [req.params.id])
        .then(result => {
            if (result.rowCount === 0) res.status(404).send(RESOURCE_NOT_FOUND)
            else res.status(200).sendFile('../../../imgs/' + result.rows[0].picture_path)
        })
})

export { ImageRouter }

