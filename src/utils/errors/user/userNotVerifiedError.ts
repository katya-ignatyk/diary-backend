import AppError from '../appError';

export class UserNotVerifiedError extends AppError {

    constructor() {
        super(403, 'User not verifed! Please, check your email');
    }
}  