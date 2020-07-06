import express from 'express';
import { SignUpController } from '../controllers/';

const router = express.Router();

router.route('/signUp')
    .post(SignUpController.addUser)

export default router;