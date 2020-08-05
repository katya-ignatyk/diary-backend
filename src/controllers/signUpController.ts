import { userInfo } from 'os';
import { Request, Response } from 'express';
import { UserService, EmailService, JwtService } from '../services';
import { catchAsync } from '../utils/errors/catchAsync';
import { validateUserData } from '../utils/validators/userValidation';
import { envConfig } from '../config';

export const signUp = catchAsync(async (req : Request, res : Response) => {
    const { email, password, username } = req.body;
    await validateUserData(email, password, username);
    const verificationToken = await UserService.Instance.createUser(email, password, username);
    await EmailService.Instance.sendVerificationEmail(email, username, verificationToken);
    res.status(201).send({ message: 'Success! Check your email to verify account' });
});

export const verifySignUp = catchAsync(async (req : Request, res : Response) => {
    const { token } = req.body;
    const verifiedToken = await JwtService.verifyAndDecodeToken(token);
    const user = UserService.Instance.verifySignUp(verifiedToken.id);
    const { email, username } = user;
    const refreshToken = JwtService.generateToken(verifiedToken.id, envConfig.JWT_REFRESH_SECRET, envConfig.JWT_REFRESH_EXPIRESIN);
    const accessToken = JwtService.generateToken(verifiedToken.id, envConfig.JWT_ACCESS_SECRET, envConfig.JWT_ACCESS_EXPIRESIN);
    res.status(200).send({ user: { email, username }, refreshToken, accessToken: accessToken, message: 'Success! You can sign in now' });
});