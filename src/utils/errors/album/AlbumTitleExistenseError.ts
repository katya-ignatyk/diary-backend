import AppError from '../appError';

export class AlbumTitleExistenseError extends AppError {

    constructor() {
        super(409, 'Album with such title already exists');
    }
}  