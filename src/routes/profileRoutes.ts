import multer from 'multer';
import { Router } from 'express';
import { IProfileController } from '../controllers/profileController/interfaces';

export interface IProfileRoutesDependencies {
    ProfileController : IProfileController;
}

export const profileRoutes = ({ ProfileController } : IProfileRoutesDependencies) => {
    const router = Router();
    
    const storage = multer.memoryStorage();
    const uploader = multer({ storage });

    router.post('/note', ProfileController.addNote);
    router.get('/:id/notes/:page', ProfileController.getNotes);
    router.put('/note', ProfileController.updateNote);
    router.delete('/note', ProfileController.deleteNote);

    router.post('/album', ProfileController.addAlbum);
    router.get('/:id/albums/:page', ProfileController.getAlbums);
    router.get('/album/:id/photos/:page', ProfileController.getAlbum);
    router.put('/album', ProfileController.updateAlbum);
    router.put('/album/background', ProfileController.updateAlbumBackground);
    router.delete('/album', ProfileController.deleteAlbum);

    router.post('/album/photos', uploader.array('photos', 15), ProfileController.addPhotos);
    router.get('/album/:id', ProfileController.getPhotos);
    router.delete('/album/photo', ProfileController.deletePhoto);
    router.put('/album/photo/status', ProfileController.updatePhotoStatus);

    return router;
};