import AppError from '../appError';

export class NoteValidationError extends AppError {

    constructor(message : string) {
        super(400, message);
    }  
}