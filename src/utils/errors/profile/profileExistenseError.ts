import AppError from '../appError';

export class ProfileExistenceError extends AppError {

    constructor() {
        super(409, 'Profile already exists');
    }
}  