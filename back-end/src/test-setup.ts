import 'dotenv/config'
import { cp, mkdir, readFile, rm } from "fs/promises"
import path from "path"
import { pool } from "./helpers/pg-pool"

module.exports = async () => {
    const shapeQuery = await readFile(path.join(__dirname + '/../db_schema.sql'), 'utf-8')
    const mockDataQuery = await readFile(path.join(__dirname + '/../fixtures.sql'), 'utf-8')
    await rm(path.join(__dirname + '/../imgs-test/'), { recursive: true })
    await mkdir(path.join(__dirname + '/../imgs-test/'))
    await cp(path.join(__dirname + '/../imgs-fixtures/'), path.join(__dirname + '/../imgs-test/'), { recursive: true })

    await pool.query(shapeQuery)
    await pool.query(mockDataQuery)
}