import AppError from '../AppError';

export class UserVallidationError extends AppError {

    constructor(message : string) {
        super(400, message);
    }  
}