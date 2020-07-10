import { Request, Response } from 'express';
import { UserService, EmailService } from '../services';
import { catchAsync } from '../utils/errors/catchAsync';
import { validateUserData } from '../utils/validators/userValidation';

export const signUp = catchAsync(async (req : Request, res : Response) => {
    const { email, password, username } = req.body;
    await validateUserData(email, password, username);
    await UserService.Instance.createUser(email, password, username);
    await EmailService.Instance.sendVerificationEmail(email);
});