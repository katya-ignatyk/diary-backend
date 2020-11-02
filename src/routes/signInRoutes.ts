import { Router } from 'express';
import { IDependencies } from '../config/awilixContainer';

export const signInRoutes = ({ signInController } : IDependencies) => {
    const router = Router();

    router.post('/signIn', (req, res) => signInController.signIn(req, res));
    router.post('/signIn/forgotPassword', (req, res) => signInController.forgotPassword(req, res));
    router.post('/signIn/resetPassword', (req, res) => signInController.resetPassword(req, res));

    router.post('/user', (req, res) => signInController.fetchUser(req, res));
    router.post('/auth', (req, res) => signInController.auth(req, res));

    return router;
};