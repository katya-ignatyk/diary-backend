import AppError from '../appError';
import { CustomErrors } from '../customErrors';

export class InvalidTokenError extends AppError {

    constructor() {
        super(401, 'Invalid token', CustomErrors.JWT_ERROR);
    }
}  