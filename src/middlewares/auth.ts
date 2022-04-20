import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

interface TokenPayload{
    id: string,
    name: string,
    email: string,
    iat: number,
    exp: number
}

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        if(req.headers.authorization){
            const [authType, token] = req.headers.authorization.split( ' ' );
            if(authType === 'Bearer'){
                try {
                    const data = JWT.verify(token, process.env.JWT_SECRET_KEY as string)
                    const { id } = data as TokenPayload

                    return next()
                } catch (error) {
                    res.status(403).json({error: 'Unauthorized'})
                }
            }
        }else{
            res.status(403).json({error: 'Unauthorized'})
        }
    }
}