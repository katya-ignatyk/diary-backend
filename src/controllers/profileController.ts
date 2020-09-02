import { Request, Response } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { ProfileService, CloudinaryService } from '../services';
import { cloudinaryFolders } from '../enums';
import { constants } from '../config';
import { ProfileNotFoundError } from '../utils/errors/profileErrors';

export const updateProfile = catchAsync(async (req : Request, res : Response) => {
    const { 
        id,
        girl_name, 
        girl_age, 
        boy_name,   
        boy_age
    } = req.body;

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

    const profile = await ProfileService.Instance.getProfileById(id);

    const imageId = await CloudinaryService.Instance.upload(
        { folder: cloudinaryFolders.avatars }, 
        image
    );
    const imageUrl = CloudinaryService.Instance.getImageUrl(imageId);
    await ProfileService.Instance.updateProfile(
        id, 
        { avatarId: imageId }
    );
    
    profile.avatarId !== constants.avatar && CloudinaryService.Instance.delete(profile.avatarId);

    res.send({ 
        avatarUrl: imageUrl,
    });
});

export const deleteAvatar = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;
    const profile = await ProfileService.Instance.getProfileById(id);

    await CloudinaryService.Instance.delete(profile.avatarId);
    await ProfileService.Instance.updateProfile(
        id, 
        { avatarId: constants.avatar }
    );
    const imageUrl = CloudinaryService.Instance.getImageUrl(constants.avatar);

    res.send({
        avatarUrl: imageUrl 
    });
});