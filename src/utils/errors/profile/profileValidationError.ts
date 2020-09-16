import AppError from '../appError';

export class ProfileValidationError extends AppError {

    constructor(message : string) {
        super(400, message);
    }  
}