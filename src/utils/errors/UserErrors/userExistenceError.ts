import AppError from '../appError';

export class UserExistenceError extends AppError {

    constructor(username : string) {
        super(409, `User ${username} already exists`);
    }
}  