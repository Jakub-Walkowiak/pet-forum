import { Pool } from 'pg'

const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME,
}

export const pool = new Pool(config)
