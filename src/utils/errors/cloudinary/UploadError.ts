import AppError from '../appError';

export class UploadError extends AppError {

    constructor(code : number, message : string) {
        super(code, message);
    }
}  