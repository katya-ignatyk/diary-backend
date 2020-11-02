import { Router } from 'express';
import { IDependencies } from '../config/awilixContainer';

export const settingsRoutes = ({ settingsController, uploader } : IDependencies) => {
    const router = Router();

    router.get('/profile/:id', (req, res) => settingsController.getProfile(req, res));
    router.put('/profile/avatar', uploader.single('avatar'), (req, res) => settingsController.updateAvatar(req, res));
    router.put('/profile', (req, res) => settingsController.updateProfile(req, res));
    router.delete('/profile/avatar', (req, res) => settingsController.deleteAvatar(req, res));

    return router;
};