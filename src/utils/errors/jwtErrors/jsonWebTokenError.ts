import AppError from '../appError';

export class JsonWebTokenError extends AppError {

    constructor(message : string, code : string) {
        super(400, message, code);
    }
}  