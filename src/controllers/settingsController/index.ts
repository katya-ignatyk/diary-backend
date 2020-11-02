import { Request, Response } from 'express';
import { cloudinaryFolders } from '../../enums';
import { constants } from '../../config';
import { validateProfileData } from '../../utils/validators';
import { ProfileNotFoundError } from '../../utils/errors/profile';
import { ICloudinaryService, IProfileService } from '../../services';
import { IDependencies } from '../../config/awilixContainer';
import { ISettingsController } from './interfaces';

export class SettingsController implements ISettingsController {
    private profileService : IProfileService;
    private cloudinaryService : ICloudinaryService;

    constructor(deps : IDependencies) {
        this.profileService = deps.profileService;
        this.cloudinaryService = deps.cloudinaryService;
    }

    async getProfile (req : Request, res : Response) {
        const { id } = req.params;
    
        const {
            id: profileid, 
            girl_name,
            girl_age,
            boy_name,
            boy_age,
            avatarId
        } = await this.profileService.getProfileById(parseInt(id));
    
        const avatarUrl = await this.cloudinaryService.getImageUrl(avatarId);
    
        res.send({
            profile: {
                id: profileid, 
                girl_name,
                girl_age,
                boy_name,
                boy_age,
                avatarUrl
            }
            
        });
    }

    async updateAvatar (req : Request, res : Response) {
        const { id } = req.body;
        const image = req.file;
    
        const { avatarId } = await this.profileService.getProfileById(id);
    
        const { url, public_id } = await this.cloudinaryService.upload(
            { folder: cloudinaryFolders.avatars }, 
            image
        );
        
        const {
            id: profileid, 
            girl_name,
            girl_age,
            boy_name,
            boy_age,
        } = await this.profileService.updateProfile(
            id, 
            { avatarId: public_id }
        );
        
        avatarId !== constants.avatar && this.cloudinaryService.delete(avatarId);
    
        res.send({ 
            profile: {
                id: profileid, 
                girl_name,
                girl_age,
                boy_name,
                boy_age,
                avatarUrl: url
            }
        });
    }

    async updateProfile (req : Request, res : Response) {
        const { 
            id,
            girl_name, 
            girl_age, 
            boy_name,   
            boy_age
        } = req.body;
    
        await validateProfileData( 
            girl_name, 
            girl_age, 
            boy_name,   
            boy_age, 
            id
        );
        
        const profile = await this.profileService.updateProfile(
            id,
            {
                girl_name, 
                girl_age, 
                boy_name,   
                boy_age
            }
        );
    
        if (!profile) {
            throw new ProfileNotFoundError();
        }
    
        res.send({
            id: profile.id,
            girl_name: profile.girl_name, 
            girl_age: profile.girl_age, 
            boy_name : profile.boy_name,   
            boy_age: profile.boy_age
        });
    }

    async deleteAvatar (req : Request, res : Response) {
        const { id } = req.body;
    
        const { avatarId } = await this.profileService.getProfileById(id);

        avatarId !== constants.avatar && await this.cloudinaryService.delete(avatarId);

        const {
            id: profileid, 
            girl_name,
            girl_age,
            boy_name,
            boy_age,
        } = await this.profileService.updateProfile(
            id, 
            { avatarId: constants.avatar }
        );

        res.send({ 
            profile: {
                id: profileid, 
                girl_name,
                girl_age,
                boy_name,
                boy_age,
                avatarUrl: constants.avatar
            }
        });
    }
}