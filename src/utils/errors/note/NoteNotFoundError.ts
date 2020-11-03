import AppError from '../appError';

export class NoteNotFoundError extends AppError {

    constructor() {
        super(404, 'Note not found');
    }
}  