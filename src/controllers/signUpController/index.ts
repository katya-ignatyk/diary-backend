import { Request, Response } from 'express';
import { validateUserData } from '../../utils/validators';
import { envConfig, constants } from '../../config';
import { isUserToken } from '../../utils/typeGuards';
import { UserNotFoundError } from '../../utils/errors/user';
import { InvalidTokenError } from '../../utils/errors/jwt';
import { IEmailService, IJwtService, IProfileService, IUserService } from '../../services';
import { IDependencies } from '../../config/awilixContainer';
import { ISignUpController } from './interfaces';

export class SignUpController implements ISignUpController {
    private userService : IUserService;
    private jwtService : IJwtService;
    private emailService : IEmailService;
    private profileService : IProfileService;

    constructor(deps : IDependencies) {
        this.userService = deps.userService;
        this.jwtService = deps.jwtService;
        this.emailService = deps.emailService;
        this.profileService = deps.profileService;
    }

    async signUp (req : Request, res : Response) {
        const { email, username, password } = req.body;

        await validateUserData(
            email, 
            password, 
            username
        );
        const { id } = await this.userService.createUser(
            email, 
            password, 
            username
        );
        const verificationToken = this.jwtService.generateToken(
            id, 
            envConfig.JWT_DEFAULT_SECRET, 
            envConfig.JWT_DEFAULT_EXPIRESIN
        );
        await this.emailService.sendVerificationEmail(
            email, 
            username, 
            verificationToken
        );
    
        res.status(201).send({ 
            message: 'Success! Check your email to verify account' 
        });
    }

    async verifySignUp (req : Request, res : Response) {
        const { token } = req.body;
        const verifiedToken = this.jwtService.verifyAndDecodeToken(
            token, 
            envConfig.JWT_DEFAULT_SECRET
        );

        if (!isUserToken(verifiedToken)) {
            throw new InvalidTokenError();
        } 

        const user = await this.userService.verifySignUp(verifiedToken.id);

        if (!user) {
            throw new UserNotFoundError();
        }
    
        const { id, email, username } = user;
        const refreshToken = this.jwtService.generateToken(
            verifiedToken.id, 
            envConfig.JWT_REFRESH_SECRET, 
            envConfig.JWT_REFRESH_EXPIRESIN
        );
        const accessToken = this.jwtService.generateToken(
            verifiedToken.id, 
            envConfig.JWT_ACCESS_SECRET, 
            envConfig.JWT_ACCESS_EXPIRESIN
        );
        const { girl_name, girl_age, boy_name, boy_age, avatar } = constants;

        await this.profileService.create(
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
    }
}