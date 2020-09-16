import { Request, Response } from 'express';
import { UserService, EmailService, JwtService, ProfileService } from '../services';
import { catchAsync } from '../utils/errors/catchAsync';
import { validateUserData } from '../utils/validators';
import { envConfig, constants } from '../config';
import { isUserToken } from '../utils/typeGuards';
import { UserNotFoundError } from '../utils/errors/user';
import { InvalidTokenError } from '../utils/errors/jwt';

export const signUp = catchAsync(async (req : Request, res : Response) => {
    const { email, username, password } = req.body;

    await validateUserData(
        email, 
        password, 
        username
    );
    const { id } = await UserService.Instance.createUser(
        email, 
        password, 
        username
    );
    const verificationToken = JwtService.generateToken(
        id, 
        envConfig.JWT_DEFAULT_SECRET, 
        envConfig.JWT_DEFAULT_EXPIRESIN
    );
    await EmailService.Instance.sendVerificationEmail(
        email, 
        username, 
        verificationToken
    );

    res.status(201).send({ 
        message: 'Success! Check your email to verify account' 
    });
});

export const verifySignUp = catchAsync(async (req : Request, res : Response) => {
    const { token } = req.body;
    const verifiedToken = await JwtService.verifyAndDecodeToken(
        token, 
        envConfig.JWT_DEFAULT_SECRET
    );

    if (!isUserToken(verifiedToken)) {
        throw new InvalidTokenError();
    } 

    const user = await UserService.Instance.verifySignUp(verifiedToken.id);

    if (!user) {
        throw new UserNotFoundError();
    }
    
    const { id, email, username } = user;
    const refreshToken = JwtService.generateToken(
        verifiedToken.id, 
        envConfig.JWT_REFRESH_SECRET, 
        envConfig.JWT_REFRESH_EXPIRESIN
    );
    const accessToken = JwtService.generateToken(
        verifiedToken.id, 
        envConfig.JWT_ACCESS_SECRET, 
        envConfig.JWT_ACCESS_EXPIRESIN
    );
    const { girl_name, girl_age, boy_name, boy_age, avatar } = constants;

    await ProfileService.Instance.create(
        id, 
        girl_name, 
        girl_age, 
        boy_name, 
        boy_age,
        avatar
    );

    res.status(200).send({ 
        user: { 
            id, 
            email, 
            username 
        },
        refreshToken, 
        accessToken, 
        message: 'Success! You can sign in now' 
    });
});
