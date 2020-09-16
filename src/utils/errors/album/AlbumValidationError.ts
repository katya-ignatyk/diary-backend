import AppError from '../appError';

export class AlbumValidationError extends AppError {

    constructor(message : string) {
        super(400, message);
    }  
}