import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';

export async function tokenValidate (req: Request, res: Response, next: NextFunction) {
    
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    const key = process.env.JWT_SECRET;

    if (!token) {
        throw {
            type: 'unauthorized',
            message: 'Token: absent'
        }
    }

    const user = Jwt.verify(token, key);

    if (!user) {
        throw {
            type: 'not_found',
            message: 'User: not found'
        }
    }

    res.locals.user = user;

    next();

}