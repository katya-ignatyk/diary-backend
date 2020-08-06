import AppError from '../appError';

export class UserExistenceError extends AppError {

    constructor() {
        super(409, 'User already exists');
    }
}  