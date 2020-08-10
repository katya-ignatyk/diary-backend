import { Request, Response } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { WelcomeService } from '../services';

export const profileExists = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;
    const profile = await WelcomeService.Instance.checkProfileExistence(id);
    res.send(profile);
});

export const createProfile = catchAsync(async (req : Request, res : Response) => {
    const { id, girl_name, girl_age, boy_name, boy_age } = req.body;
    await WelcomeService.Instance.createProfile(id, girl_name, girl_age, boy_name, boy_age);
    res.sendStatus(200);
});