import jwt from 'jsonwebtoken';
import { JwtExpiredError, JsonWebTokenError } from '../utils/errors/jwtErrors';
import { envConfig } from '../config';
import { CustomErors } from '../utils/errors/customErrors';

type JwtError = 'TokenExpiredError' | 'JsonWebTokenError';

export class JwtService {
    
    public static generateToken(id : number, jwtSecret : string, expiresInTime : string) : string {
        return jwt.sign({ id }, jwtSecret, {
            expiresIn: expiresInTime
        });
    }

    public static verifyAndDecodeToken(token : string, jwtSecret : string) {
        try {
            return jwt.verify(token, jwtSecret);
        } catch (error) {   
            const errorName : JwtError = error.name;
            const errorMessage =`${error.name}: ${error.message}`;

            if (errorName === 'TokenExpiredError') {

                if (jwtSecret === envConfig.JWT_REFRESH_SECRET) {
                    throw new JwtExpiredError(errorMessage, CustomErors.REFRESH_EXPIRED);
                }

                if (jwtSecret === envConfig.JWT_ACCESS_SECRET) {
                    throw new JwtExpiredError(errorMessage, CustomErors.ACCESS_EXPIRED);
                }
                throw new JwtExpiredError(errorMessage, CustomErors.DEFAULT_EXPIRED);
            }

            if (errorName === 'JsonWebTokenError') {
                throw new JsonWebTokenError(errorMessage, CustomErors.JWT_ERROR);
            }
        }
    }
}