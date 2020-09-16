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
router.put('/settings/profile/avatar', uploader.single('avatar'), SettingsController.updateAvatar);
router.delete('/settings/profile/avatar', SettingsController.deleteAvatar);

router.post('/profile/note', ProfileController.addNote);
router.get('/profile/:id/notes', ProfileController.getNotes);
router.put('/profile/note', ProfileController.updateNote);
router.delete('/profile/note', ProfileController.deleteNote);

router.post('/profile/album', ProfileController.addAlbum);
router.get('/profile/:id/albums', ProfileController.getAlbums);
router.put('/profile/album', ProfileController.updateAlbum);
router.put('/profile/album/background', ProfileController.updateAlbumBackground);
router.delete('/profile/album', ProfileController.deleteAlbum);

router.post('/profile/album/photos', uploader.array('photos', 5), ProfileController.addPhotos);
router.get('/profile/album/:id', ProfileController.getPhotos);
router.delete('/profile/album/photo', ProfileController.deletePhoto);
router.put('/profile/album/photo/status', ProfileController.updatePhotoStatus);

export default router;