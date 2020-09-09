import express from 'express';
import multer from 'multer';
import { SignUpController, SignInController, SettingsController, ProfileController } from '../controllers';

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

router.put('/settings/profile', SettingsController.updateProfile);
router.put('/settings/profile/avatar', uploader.single('image'), SettingsController.updateAvatar);
router.delete('/settings/profile/avatar', SettingsController.deleteAvatar);

router.post('/note', ProfileController.addNote);
router.post('/profile/notes', ProfileController.getNotes);
router.put('/profile/note', ProfileController.updateNote);
router.delete('/profile/note', ProfileController.deleteNote);

export default router;