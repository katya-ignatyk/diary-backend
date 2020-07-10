import express from 'express';
import { SignUpController, VerifySignUpController } from '../controllers';

const router = express.Router();

router.post('/signUp', SignUpController.signUp);
router.get('/signUp/verify/:token', VerifySignUpController.verifySignUp);

export default router;