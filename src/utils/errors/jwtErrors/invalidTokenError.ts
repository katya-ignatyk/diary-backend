import AppError from '../appError';

export class InvalidTokenError extends AppError {

    constructor() {
        super(401, 'Invalid token');
    }
}  