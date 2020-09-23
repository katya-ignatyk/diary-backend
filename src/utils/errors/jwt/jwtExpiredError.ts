import AppError from '../appError';

export class JwtExpiredError extends AppError {

    constructor(message : string, code ?: string) {
        super(401, message, code);
    }
}  