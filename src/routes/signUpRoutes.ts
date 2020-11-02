import { Router } from 'express';
import { ISignUpController } from '../controllers/signUpController/interfaces';

export interface ISignUpRoutesDependencies {
    SignUpController : ISignUpController;
}

export const signUpRoutes = ({ SignUpController } : ISignUpRoutesDependencies) => {
    const router = Router();

    router.post('/', SignUpController.signUp);
    router.post('/verify', SignUpController.verifySignUp);

    return router;
};