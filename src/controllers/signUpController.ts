import { Request, Response } from 'express';
import { UserService, EmailService, JwtService } from '../services';
import { catchAsync } from '../utils/errors/catchAsync';
import { validateUserData } from '../utils/validators/userValidation';
import { envConfig } from '../config';

export const signUp = catchAsync(async (req : Request, res : Response) => {
    const { email, password, username } = req.body;
    await validateUserData(email, password, username);
    const accessToken = await UserService.Instance.createUser(email, password, username);
    await EmailService.Instance.sendVerificationEmail(email, username, accessToken);
    res.send({ accessToken : accessToken });
});

export const verifySignUp = catchAsync(async (req : Request, res : Response) => {
    const token = req.params.token;
    const verifiedAccessToken = await JwtService.verifyAndDecodeToken(token);
    const refreshToken = JwtService.generateToken(verifiedAccessToken.id, envConfig.JWT_REFRESH_SECRET, envConfig.JWT_REFRESH_EXPIRESIN);
    res.status(200).send({ refreshToken, accessToken : verifiedAccessToken });
});