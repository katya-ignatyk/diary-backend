import AppError from '../appError';

export class ProfileNotFoundError extends AppError {

    constructor() {
        super(404, 'Profile not found');
    }
}  