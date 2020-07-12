import jwt from 'jsonwebtoken';
import { envConfig } from '../config';
import { jwtWebTokenError } from '../utils/errors/userErrors/jwtWebTokenError';

type JwtError = 'TokenExpiredError' | 'JsonWebTokenError';

export class JwtService {
    
    public static generateToken(id : number, jwtSecret : string, expiresInTime : string) : string {
        return jwt.sign({ id }, jwtSecret, {
            expiresIn: expiresInTime
        });
    }

    public static verifyAndDecodeToken(token : string) {
        try {
            return jwt.verify(token, envConfig.JWT_ACCESS_SECRET);
        } catch (error) {
            const errorName : JwtError = error.name;
            throw new jwtWebTokenError(`${errorName}: ${error.message}`);
        }
    }
}