import AppError from '../appError';

export class DeleteFolderError extends AppError {

    constructor(code : number, message : string) {
        super(code, message);
    }
}  