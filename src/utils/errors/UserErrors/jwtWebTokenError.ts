import AppError from '../appError';

export class jwtWebTokenError extends AppError {

    constructor(message : string) {
        super(401, message);
    }
}  