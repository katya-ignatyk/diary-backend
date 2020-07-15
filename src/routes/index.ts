import express from 'express';
import { SignUpController } from '../controllers';

const router = express.Router();

router.post('/signUp', SignUpController.signUp);
router.get('/signUp/verify/:token', SignUpController.verifySignUp);

export default router;