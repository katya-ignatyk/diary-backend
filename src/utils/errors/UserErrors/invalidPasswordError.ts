import AppError from '../appError';

export class InvalidPasswordError extends AppError {

    constructor() {
        super(401, 'Invalid password');
    }
}  