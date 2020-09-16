import AppError from '../appError';
import { CustomErrors } from '../customErrors';

export class ProfileNotFoundError extends AppError {

    constructor() {
        super(404, 'Profile not found', CustomErrors.PROFILE_NOT_FOUND);
    }
}  