import AppError from '../appError';

export class UserNotVerifedError extends AppError {

    constructor() {
        super(401, 'User not verifed! Please, check your email');
    }
}  