import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { catchAsync } from '../utils/errors/catchAsync';
import { validateUserData } from '../utils/validators/userValidation';

export const signUp = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const { email, password } = req.body;
    await validateUserData(email, password);
    await UserService.Instance.createUser(email, password);
    res.sendStatus(200);
});
