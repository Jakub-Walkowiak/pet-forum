import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AUTHENTICATION_FAILED, INTERNAL_SERVER_ERROR } from '../helpers/status-codes'

const auth = (req: Request, res :Response, next: NextFunction) => {
    const secret = process.env.JWT_SECRET

    if (secret === undefined) res.status(502).json(INTERNAL_SERVER_ERROR)
    else {
        try {
            const payload = jwt.verify(req.cookies.login_token, secret)
            req.body.id = (<{id: number}>payload).id
            next()
        } catch { res.status(401).json(AUTHENTICATION_FAILED) }
    }
}

export default auth 