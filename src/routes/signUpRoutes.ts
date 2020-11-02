import { Router } from 'express';
import { IDependencies } from '../config/awilixContainer';

export const signUpRoutes = ({ signUpController } : IDependencies) => {
    const router = Router();

    router.post('/', (req, res) => signUpController.signUp(req, res));
    router.post('/verify', (req, res) => signUpController.verifySignUp(req, res));

    return router;
};