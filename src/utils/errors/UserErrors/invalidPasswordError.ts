import AppError from '../appError';

export class InvalidPasswordError extends AppError {

    constructor() {
        super(400, 'Invalid password');
    }
}  