import jwt from 'jsonwebtoken';
import { JwtExpiredError, JsonWebTokenError } from '../utils/errors/jwt';
import { envConfig } from '../config';
import { CustomErrors } from '../utils/errors/customErrors';

type JwtError = 'TokenExpiredError' | 'JsonWebTokenError';

export interface IJwtService {
    generateToken(id : number, jwtSecret : string, expiresInTime : string) : string;
    verifyAndDecodeToken(token : string, jwtSecret : string) : string;
}

export class JwtService {
    
    public generateToken(id : number, jwtSecret : string, expiresInTime : string) : string {
        return jwt.sign({ id }, jwtSecret, {
            expiresIn: expiresInTime
        });
    }

    public verifyAndDecodeToken(token : string, jwtSecret : string) {
        try {
            return jwt.verify(token, jwtSecret);
        } catch (error) {   
            const errorName : JwtError = error.name;
            const errorMessage =`${error.name}: ${error.message}`;

            if (errorName === 'TokenExpiredError') {

                if (jwtSecret === envConfig.JWT_REFRESH_SECRET) {
                    throw new JwtExpiredError(errorMessage, CustomErrors.REFRESH_EXPIRED);
                }

                if (jwtSecret === envConfig.JWT_ACCESS_SECRET) {
                    throw new JwtExpiredError(errorMessage, CustomErrors.ACCESS_EXPIRED);
                }
                throw new JwtExpiredError(errorMessage, CustomErrors.DEFAULT_EXPIRED);
            }

            if (errorName === 'JsonWebTokenError') {
                throw new JsonWebTokenError(errorMessage, CustomErrors.JWT_ERROR);
            }
        }
    }
}