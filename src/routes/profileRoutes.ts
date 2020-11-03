import { Router } from 'express';
import { IDependencies } from '../config/awilixContainer';

export const profileRoutes = ({ profileController, uploader } : IDependencies) => {
    const router = Router();

    router.post('/note', (req, res) => profileController.addNote(req, res));
    router.get('/:id/notes/:page', (req, res) => profileController.getNotes(req, res));
    router.put('/note', (req, res) => profileController.updateNote(req, res));
    router.delete('/note', (req, res) => profileController.deleteNote(req, res));

    router.post('/album', (req, res) => profileController.addAlbum(req, res));
    router.get('/:id/albums/:page', (req, res) => profileController.getAlbums(req, res));
    router.get('/album/:id/photos/:page', (req, res) => profileController.getAlbum(req, res));
    router.put('/album', (req, res) => profileController.updateAlbum(req, res));
    router.put('/album/background', (req, res) => profileController.updateAlbumBackground(req, res));
    router.delete('/album', (req, res) => profileController.deleteAlbum(req, res));

    router.post('/album/photos', uploader.array('photos', 15), (req, res) => profileController.addPhotos(req, res));
    router.get('/album/:id', (req, res) => profileController.getPhotos(req, res));
    router.delete('/album/photo', (req, res) => profileController.deletePhoto(req, res));
    router.put('/album/photo/status', (req, res) => profileController.updatePhotoStatus(req, res));

    return router;
};