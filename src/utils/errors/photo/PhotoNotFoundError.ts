import AppError from '../appError';

export class PhotoNotFoundError extends AppError {

    constructor() {
        super(404, 'Photo not found');
    }
}  