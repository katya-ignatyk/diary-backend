import AppError from '../appError';

export class ImagePublicIdError extends AppError {

    constructor() {
        super(404, 'Image public id is not found');
    }
}  