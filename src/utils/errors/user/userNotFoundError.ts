import AppError from '../appError';

export class UserNotFoundError extends AppError {

    constructor() {
        super(404, 'User not found');
    }
}  