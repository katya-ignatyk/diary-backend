import AppError from '../AppError';

export class UserExistsError extends AppError {

    constructor(username : string) {
        super(409, `User ${username} already exists`);
    }
}  