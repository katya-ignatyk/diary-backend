import multer from 'multer';
import { Router } from 'express';
import { ISettingsController } from '../controllers/settingsController/interfaces';

export interface ISettingsRoutesDependencies {
    SettingsController : ISettingsController;
}

export const settingsRoutes = ({ SettingsController } : ISettingsRoutesDependencies) => {
    const router = Router();
    
    const storage = multer.memoryStorage();
    const uploader = multer({ storage });

    router.get('/profile/:id', SettingsController.getProfile);
    router.put('/profile/avatar', uploader.single('avatar'), SettingsController.updateAvatar);
    router.put('/profile', SettingsController.updateProfile);
    router.delete('/profile/avatar', SettingsController.deleteAvatar);

    return router;
};