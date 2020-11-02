import { Request, Response } from 'express';
import { cloudinaryFolders } from '../../enums';
import { constants } from '../../config';
import { validateProfileData } from '../../utils/validators';
import { ProfileNotFoundError } from '../../utils/errors/profile';
import { ICloudinaryService, IProfileService } from '../../services';
import { ISettingsControllerDependencies, ISettingsController } from './interfaces';

export class SettingsController implements ISettingsController {
    private ProfileService : IProfileService;
    private CloudinaryService : ICloudinaryService;

    constructor({ 
        ProfileService, 
        CloudinaryService 
    } : ISettingsControllerDependencies) {
        this.ProfileService = ProfileService;
        this.CloudinaryService = CloudinaryService;
        
        this.getProfile = this.getProfile.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
        this.deleteAvatar = this.deleteAvatar.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
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
        } = await this.ProfileService.getProfileById(parseInt(id));
    
        const avatarUrl = await this.CloudinaryService.getImageUrl(avatarId);
    
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
    
        const { avatarId } = await this.ProfileService.getProfileById(id);
    
        const { url, public_id } = await this.CloudinaryService.upload(
            { folder: cloudinaryFolders.avatars }, 
            image
        );
        
        const {
            id: profileid, 
            girl_name,
            girl_age,
            boy_name,
            boy_age,
        } = await this.ProfileService.updateProfile(
            id, 
            { avatarId: public_id }
        );
        
        avatarId !== constants.avatar && this.CloudinaryService.delete(avatarId);
    
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
        
        const profile = await this.ProfileService.updateProfile(
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
    
        const { avatarId } = await this.ProfileService.getProfileById(id);

        avatarId !== constants.avatar && await this.CloudinaryService.delete(avatarId);

        const {
            id: profileid, 
            girl_name,
            girl_age,
            boy_name,
            boy_age,
        } = await this.ProfileService.updateProfile(
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