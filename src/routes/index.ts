import express from 'express';
import { SignUpController, SignInController } from '../controllers';

const router = express.Router();

router.post('/signUp', SignUpController.signUp);
router.post('/signUp/verify', SignUpController.verifySignUp);
router.post('/signIn', SignInController.signIn);
router.post('/forgotPassword', SignInController.forgotPassword);
router.post('/resetPassword', SignInController.resetPassword);
router.post('/fetchUser', SignInController.fetchUser);
router.post('/refreshAccessToken', SignInController.refreshAccessToken);

export default router;