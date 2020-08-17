import { Request, Response } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { ProfileService } from '../services';

export const profileExists = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;
    const profile = await ProfileService.Instance.checkProfileExistence(id);
    res.send({ profile });
});

export const saveProfileChanges = catchAsync(async (req : Request, res : Response) => {
    const { 
        userId, 
        profile: { 
            girl_name, 
            girl_age, 
            boy_name, 
            boy_age 
        } 
    } = req.body;

    const profile = await ProfileService.Instance.saveProfileChanges(
        userId, 
        girl_name, 
        girl_age, 
        boy_name, 
        boy_age
    );
    res.status(200).send({ profile });
});