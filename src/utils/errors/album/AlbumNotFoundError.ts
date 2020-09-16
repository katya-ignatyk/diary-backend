import AppError from '../appError';

export class AlbumNotFoundError extends AppError {

    constructor() {
        super(404, 'Album not found');
    }
}  