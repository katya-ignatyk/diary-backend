import { Response, Request } from 'express';
import { envConfig } from '../../config';
import { isUserToken } from '../../utils/typeGuards';
import { InvalidTokenError } from '../../utils/errors/jwt';
import { ICloudinaryService, IEmailService, IJwtService, IProfileService, IUserService } from '../../services';
import { catchAsync } from '../../utils/errors/catchAsync';
import { IDependencies } from '../../config/awilixContainer';
import { ISignInController } from './interfaces';

export class SignInController implements ISignInController {
    private userService : IUserService;
    private jwtService : IJwtService;
    private emailService : IEmailService;
    private profileService : IProfileService;
    private cloudinaryService : ICloudinaryService;

    constructor(deps : IDependencies) {
        this.userService = deps.userService;
        this.jwtService = deps.jwtService;
        this.emailService = deps.emailService;
        this.profileService = deps.profileService;
        this.cloudinaryService = deps.cloudinaryService;
    }

    async signIn (req : Request, res : Response) {
        const { email, password } = req.body;
        const user = await this.userService.authorizeUser(email, password);
        const { id, username } = user;
    
        const accessToken = this.jwtService.generateToken(
            id, 
            envConfig.JWT_ACCESS_SECRET, 
            envConfig.JWT_ACCESS_EXPIRESIN
        );
        const refreshToken = this.jwtService.generateToken(
            id, 
            envConfig.JWT_REFRESH_SECRET, 
            envConfig.JWT_REFRESH_EXPIRESIN
        );
    
        const profile = await this.profileService.getProfileById(user.profile.id);
        const imageUrl = await this.cloudinaryService.getImageUrl(user.profile.avatarId);
    
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

        const { id, username } = await this.userService.checkEmailExistence(email);
        const resetToken = this.jwtService.generateToken(
            id, 
            envConfig.JWT_DEFAULT_SECRET, 
            envConfig.JWT_DEFAULT_EXPIRESIN
        );
        await this.emailService.sendForgotPasswordEmail(email, username, resetToken);
    
        res.status(200).send({ 
            message: 'Success! Check your email to reset pasword' 
        });
    }

    async resetPassword (req : Request, res : Response) {
        const { password, token } = req.body;
        const verifiedToken = this.jwtService.verifyAndDecodeToken(
            token, 
            envConfig.JWT_DEFAULT_SECRET
        );
    
        if (!isUserToken(verifiedToken)) {
            throw new InvalidTokenError();
        } 
    
        await this.userService.resetPassword(password, verifiedToken.id);

        res.status(200).send({ 
            message: 'Success!' 
        });
    }

    async fetchUser (req : Request, res : Response) {
        const { accessToken } = req.body;
            
        if (!accessToken) {
            throw new InvalidTokenError();
        }
    
        const verifiedToken = this.jwtService.verifyAndDecodeToken(
            accessToken, 
            envConfig.JWT_ACCESS_SECRET
        );

        if (!isUserToken(verifiedToken)) {
            throw new InvalidTokenError();
        } 

        const user = await this.userService.getUserById(verifiedToken.id);

        const { id, email, username } = user;

        const profile = await this.profileService.getProfileById(user.profile.id);
        const imageUrl = this.cloudinaryService.getImageUrl(user.profile.avatarId);

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

        const verifiedRefreshToken = this.jwtService.verifyAndDecodeToken(
            refreshToken, 
            envConfig.JWT_REFRESH_SECRET
        );

        if (!isUserToken(verifiedRefreshToken)) {
            throw new InvalidTokenError();
        } 

        const newRefreshToken = this.jwtService.generateToken(
            verifiedRefreshToken.id,
            envConfig.JWT_REFRESH_SECRET, 
            envConfig.JWT_REFRESH_EXPIRESIN
        );
        const newAccessToken = this.jwtService.generateToken(
            verifiedRefreshToken.id, 
            envConfig.JWT_ACCESS_SECRET, 
            envConfig.JWT_ACCESS_EXPIRESIN
        );
        const user = await this.userService.getUserById(verifiedRefreshToken.id);

        const { id, email, username } = user;

        const profile = await this.profileService.getProfileById(user.profile.id);
        const imageUrl = await this.cloudinaryService.getImageUrl(user.profile.avatarId);

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