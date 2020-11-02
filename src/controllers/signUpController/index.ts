import { Request, Response } from 'express';
import { validateUserData } from '../../utils/validators';
import { envConfig, constants } from '../../config';
import { isUserToken } from '../../utils/typeGuards';
import { UserNotFoundError } from '../../utils/errors/user';
import { InvalidTokenError } from '../../utils/errors/jwt';
import { IEmailService, IJwtService, IProfileService, IUserService } from '../../services';
import { ISignUpControllerDependencies, ISignUpController } from './interfaces';

export class SignUpController implements ISignUpController {
    private UserService : IUserService;
    private JwtService : IJwtService;
    private EmailService : IEmailService;
    private ProfileService : IProfileService;

    constructor({ 
        UserService, 
        EmailService, 
        JwtService, 
        ProfileService 
    } : ISignUpControllerDependencies) {
        this.UserService = UserService;
        this.JwtService = JwtService;
        this.EmailService = EmailService;
        this.ProfileService = ProfileService;

        this.signUp = this.signUp.bind(this);
        this.verifySignUp = this.verifySignUp.bind(this);
    }

    async signUp (req : Request, res : Response) {
        const { email, username, password } = req.body;

        await validateUserData(
            email, 
            password, 
            username
        );
        const { id } = await this.UserService.createUser(
            email, 
            password, 
            username
        );
        const verificationToken = this.JwtService.generateToken(
            id, 
            envConfig.JWT_DEFAULT_SECRET, 
            envConfig.JWT_DEFAULT_EXPIRESIN
        );
        await this.EmailService.sendVerificationEmail(
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
        const verifiedToken = this.JwtService.verifyAndDecodeToken(
            token, 
            envConfig.JWT_DEFAULT_SECRET
        );

        if (!isUserToken(verifiedToken)) {
            throw new InvalidTokenError();
        } 

        const user = await this.UserService.verifySignUp(verifiedToken.id);

        if (!user) {
            throw new UserNotFoundError();
        }
    
        const { id, email, username } = user;
        const refreshToken = this.JwtService.generateToken(
            verifiedToken.id, 
            envConfig.JWT_REFRESH_SECRET, 
            envConfig.JWT_REFRESH_EXPIRESIN
        );
        const accessToken = this.JwtService.generateToken(
            verifiedToken.id, 
            envConfig.JWT_ACCESS_SECRET, 
            envConfig.JWT_ACCESS_EXPIRESIN
        );
        const { girl_name, girl_age, boy_name, boy_age, avatar } = constants;

        await this.ProfileService.create(
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