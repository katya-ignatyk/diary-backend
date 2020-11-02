import { Router } from 'express';
import { ISignInController } from '../controllers/signInController/interfaces';

export interface ISignInRouteDependencies {
    SignInController : ISignInController;
}

export const signInRoutes = ({ SignInController } : ISignInRouteDependencies) => {
    const router = Router();

    router.post('/signIn', SignInController.signIn);
    router.post('/signIn/forgotPassword', SignInController.forgotPassword);
    router.post('/signIn/resetPassword', SignInController.resetPassword);

    router.post('/user', SignInController.fetchUser);
    router.post('/auth', SignInController.auth);

    return router;
};