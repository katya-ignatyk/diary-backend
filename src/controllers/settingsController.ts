import { Request, Response } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { ProfileService, CloudinaryService } from '../services';
import { cloudinaryFolders } from '../enums';
import { constants } from '../config';
import { ProfileNotFoundError } from '../utils/errors/profile';
import { validateProfileData } from '../utils/validators';

export const getProfile = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;
    
    const {
        id: profileid, 
        girl_name,
        girl_age,
        boy_name,
        boy_age,
        avatarId
    } = await ProfileService.Instance.getProfileById(id);

    const avatarUrl = await CloudinaryService.Instance.getImageUrl(avatarId);

    res.send({
        profile: {
            profileid, 
            girl_name,
            girl_age,
            boy_name,
            boy_age,
            avatarUrl
        }
        
    });
});

export const updateProfile = catchAsync(async (req : Request, res : Response) => {
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
    
    const profile = await ProfileService.Instance.updateProfile(
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
});

export const updateAvatar = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;
    const image = req.file;

    const { avatarId } = await ProfileService.Instance.getProfileById(id);

    const { url, public_id } = await CloudinaryService.Instance.upload(
        { folder: cloudinaryFolders.avatars }, 
        image
    );
    
    const {
        id: profileid, 
        girl_name,
        girl_age,
        boy_name,
        boy_age,
    } = await ProfileService.Instance.updateProfile(
        id, 
        { avatarId: public_id }
    );
    
    avatarId !== constants.avatar && CloudinaryService.Instance.delete(avatarId);

    res.send({ 
        profile: {
            profileid, 
            girl_name,
            girl_age,
            boy_name,
            boy_age,
            avatarUrl: url
        }
    });
});

export const deleteAvatar = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;
    
    const { avatarId } = await ProfileService.Instance.getProfileById(id);

    await CloudinaryService.Instance.delete(avatarId);
    await ProfileService.Instance.updateProfile(
        id, 
        { avatarId: constants.avatar }
    );

    res.sendStatus(200);
});