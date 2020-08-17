import { Response, Request } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { UserService, JwtService, EmailService } from '../services';
import { envConfig } from '../config';
import { isUserToken } from '../utils/typeGuards';
import { InvalidTokenError } from '../utils/errors/jwtErrors';

export const signIn = catchAsync(async (req : Request, res : Response) => {
    const { email, password } = req.body;
    const { id, username } = await UserService.Instance.authorizeUser(email, password);

    const accessToken = JwtService.generateToken(
        id, 
        envConfig.JWT_ACCESS_SECRET, 
        envConfig.JWT_ACCESS_EXPIRESIN
    );
    const refreshToken = JwtService.generateToken(
        id, 
        envConfig.JWT_REFRESH_SECRET, 
        envConfig.JWT_REFRESH_EXPIRESIN
    );
    
    res.status(201).send({ 
        user : { id, email, username }, 
        accessToken, refreshToken, 
        message: 'Success!' 
    });
});

export const forgotPassword = catchAsync(async (req : Request, res : Response) => {
    const { email } = req.body;

    const { id, username } = await UserService.Instance.checkEmailExistence(email);
    const resetToken = JwtService.generateToken(
        id, 
        envConfig.JWT_DEFAULT_SECRET, 
        envConfig.JWT_DEFAULT_EXPIRESIN
    );
    await EmailService.Instance.sendForgotPasswordEmail(email, username, resetToken);
    
    res.status(200).send({ 
        message: 'Success! Check your email to reset pasword' 
    });
});

export const resetPassword = catchAsync(async (req : Request, res : Response) => {
    const { password, token } = req.body;
    const verifiedToken = JwtService.verifyAndDecodeToken(
        token, 
        envConfig.JWT_DEFAULT_SECRET
    );

    if (!isUserToken(verifiedToken)) {
        throw new InvalidTokenError();
    } 

    await UserService.Instance.resetPassword(password, verifiedToken.id);
    res.status(200).send({ 
        message: 'Success!' 
    });
});

export const fetchUser = catchAsync(async(req : Request, res : Response) => {
    const { accessToken } = req.body;
    const verifiedToken = JwtService.verifyAndDecodeToken(
        accessToken, 
        envConfig.JWT_ACCESS_SECRET
    );

    if (!isUserToken(verifiedToken)) {
        throw new InvalidTokenError();
    } 

    const user = await UserService.Instance.getUserById(verifiedToken.id);

    const { id, email, username } = user;

    res.status(201).send({ 
        user: { id, email, username } 
    });
});

export const refreshAccessToken = catchAsync(async(req : Request, res : Response) => {
    const { refreshToken } = req.body;
    const verifiedRefreshToken = JwtService.verifyAndDecodeToken(
        refreshToken, 
        envConfig.JWT_REFRESH_SECRET
    );

    if (!isUserToken(verifiedRefreshToken)) {
        throw new InvalidTokenError();
    } 

    const newRefreshToken = JwtService.generateToken(
        verifiedRefreshToken.id,
        envConfig.JWT_REFRESH_SECRET, 
        envConfig.JWT_REFRESH_EXPIRESIN
    );
    const newAccessToken = JwtService.generateToken(
        verifiedRefreshToken.id, 
        envConfig.JWT_ACCESS_SECRET, 
        envConfig.JWT_ACCESS_EXPIRESIN
    );
    const user = await UserService.Instance.getUserById(verifiedRefreshToken.id);

    const { id, email, username } = user;
    res.status(200).send({ 
        refreshToken: newRefreshToken, 
        accessToken: newAccessToken, 
        user: { id, email, username } 
    });
});
