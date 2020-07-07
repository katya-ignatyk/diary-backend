import express from 'express';
import { SignUpController } from '../controllers';

const router = express.Router();

router.post('/signUp', SignUpController.signUp);

export default router;