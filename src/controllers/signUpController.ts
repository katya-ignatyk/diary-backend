import { Request, Response } from 'express';
import { UserService } from '../services';
import { catchAsync } from '../utils/errors/catchAsync';
import { validateUserData } from '../utils/validators/userValidation';

export const signUp = catchAsync(async (req : Request, res : Response) => {
    const { email, password } = req.body;
    await validateUserData(email, password);
    await UserService.Instance.createUser(email, password);
});