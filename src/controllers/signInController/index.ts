import { Response, Request } from 'express';
import { envConfig } from '../../config';
import { isUserToken } from '../../utils/typeGuards';
import { InvalidTokenError } from '../../utils/errors/jwt';
import { ICloudinaryService, IEmailService, IJwtService, IProfileService, IUserService } from '../../services';
import { catchAsync } from '../../utils/errors/catchAsync';
import { ISignInControllerDependencies, ISignInController } from './interfaces';

export class SignInController implements ISignInController {
    private UserService : IUserService;
    private JwtService : IJwtService;
    private EmailService : IEmailService;
    private ProfileService : IProfileService;
    private CloudinaryService : ICloudinaryService;

    constructor({ 
        UserService, 
        JwtService, 
        EmailService, 
        ProfileService, 
        CloudinaryService 
    } : ISignInControllerDependencies) {
        this.UserService = UserService;
        this.JwtService = JwtService;
        this.EmailService = EmailService;
        this.ProfileService = ProfileService;
        this.CloudinaryService = CloudinaryService;

        this.signIn = this.signIn.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.auth = this.auth.bind(this);
    }

    async signIn (req : Request, res : Response) {
        const { email, password } = req.body;
        const user = await this.UserService.authorizeUser(email, password);
        const { id, username } = user;
    
        const accessToken = this.JwtService.generateToken(
            id, 
            envConfig.JWT_ACCESS_SECRET, 
            envConfig.JWT_ACCESS_EXPIRESIN
        );
        const refreshToken = this.JwtService.generateToken(
            id, 
            envConfig.JWT_REFRESH_SECRET, 
            envConfig.JWT_REFRESH_EXPIRESIN
        );
    
        const profile = await this.ProfileService.getProfileById(user.profile.id);
        const imageUrl = await this.CloudinaryService.getImageUrl(user.profile.avatarId);
    
        const { 
            id: profileId,
            boy_name,
            boy_age,
            girl_name,
            girl_age,
        } = profile;
    
        res.status(201).send({ 
            user : { 
                id, 
                email, 
                username 
            }, 
            profile: {
                id: profileId,
                boy_name,
                boy_age,
                girl_name,
                girl_age,
                avatarUrl: imageUrl
            },
            accessToken, 
            refreshToken, 
            message: 'Success!' 
        }); 
        
    } 

    async forgotPassword (req : Request, res : Response) {
        const { email } = req.body;

        const { id, username } = await this.UserService.checkEmailExistence(email);
        const resetToken = this.JwtService.generateToken(
            id, 
            envConfig.JWT_DEFAULT_SECRET, 
            envConfig.JWT_DEFAULT_EXPIRESIN
        );
        await this.EmailService.sendForgotPasswordEmail(email, username, resetToken);
    
        res.status(200).send({ 
            message: 'Success! Check your email to reset pasword' 
        });
    }

    async resetPassword (req : Request, res : Response) {
        const { password, token } = req.body;
        const verifiedToken = this.JwtService.verifyAndDecodeToken(
            token, 
            envConfig.JWT_DEFAULT_SECRET
        );
    
        if (!isUserToken(verifiedToken)) {
            throw new InvalidTokenError();
        } 
    
        await this.UserService.resetPassword(password, verifiedToken.id);

        res.status(200).send({ 
            message: 'Success!' 
        });
    }

    async fetchUser (req : Request, res : Response) {
        const { accessToken } = req.body;
            
        if (!accessToken) {
            throw new InvalidTokenError();
        }
    
        const verifiedToken = this.JwtService.verifyAndDecodeToken(
            accessToken, 
            envConfig.JWT_ACCESS_SECRET
        );

        if (!isUserToken(verifiedToken)) {
            throw new InvalidTokenError();
        } 

        const user = await this.UserService.getUserById(verifiedToken.id);

        const { id, email, username } = user;

        const profile = await this.ProfileService.getProfileById(user.profile.id);
        const imageUrl = this.CloudinaryService.getImageUrl(user.profile.avatarId);

        const { 
            id: profileId,
            boy_name,
            boy_age,
            girl_name,
            girl_age,
        } = profile;

        res.status(201).send({ 
            user: { 
                id, 
                email, 
                username 
            },
            profile: {
                id: profileId,
                boy_name,
                boy_age,
                girl_name,
                girl_age,
                avatarUrl: imageUrl
            }
        });
    }

    async auth (req : Request, res : Response) {

        const { refreshToken } = req.body;

        const verifiedRefreshToken = this.JwtService.verifyAndDecodeToken(
            refreshToken, 
            envConfig.JWT_REFRESH_SECRET
        );

        if (!isUserToken(verifiedRefreshToken)) {
            throw new InvalidTokenError();
        } 

        const newRefreshToken = this.JwtService.generateToken(
            verifiedRefreshToken.id,
            envConfig.JWT_REFRESH_SECRET, 
            envConfig.JWT_REFRESH_EXPIRESIN
        );
        const newAccessToken = this.JwtService.generateToken(
            verifiedRefreshToken.id, 
            envConfig.JWT_ACCESS_SECRET, 
            envConfig.JWT_ACCESS_EXPIRESIN
        );
        const user = await this.UserService.getUserById(verifiedRefreshToken.id);

        const { id, email, username } = user;

        const profile = await this.ProfileService.getProfileById(user.profile.id);
        const imageUrl = await this.CloudinaryService.getImageUrl(user.profile.avatarId);

        const { 
            id: profileId,
            boy_name,
            boy_age,
            girl_name,
            girl_age,
        } = profile;

        res.status(200).send({ 
            refreshToken: newRefreshToken, 
            accessToken: newAccessToken, 
            user: { 
                id, 
                email, 
                username 
            },
            profile: {
                id: profileId,
                boy_name,
                boy_age,
                girl_name,
                girl_age,
                avatarUrl: imageUrl
            } 
        });
        
    }
}