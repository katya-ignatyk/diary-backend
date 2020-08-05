import AppError from '../appError';

export class UserNotFoundError extends AppError {

    constructor() {
        super(400, 'User not found');
    }
}  