import express from 'express';
import multer from 'multer';
import { SignUpController, SignInController, ProfileController } from '../controllers';

const router = express.Router();

const storage = multer.memoryStorage();
const uploader = multer({ storage });

router.post('/signUp', SignUpController.signUp);
router.post('/signUp/verify', SignUpController.verifySignUp);

router.post('/signIn', SignInController.signIn);
router.post('/signIn/forgotPassword', SignInController.forgotPassword);
router.post('/signIn/resetPassword', SignInController.resetPassword);

router.post('/user', SignInController.fetchUser);
router.post('/auth', SignInController.auth);

router.put('/profile', ProfileController.updateProfile);
router.put('/profile/avatar', uploader.single('image'), ProfileController.updateAvatar);
router.delete('/profile/avatar', ProfileController.deleteAvatar);

export default router;