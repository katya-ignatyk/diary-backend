import { Request, Response } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { NoteService, ProfileService, AlbumService, CloudinaryService, PhotoService } from '../services';
import { AlbumTitleExistenseError } from '../utils/errors/album';
import { PhotoNotFoundError } from '../utils/errors/photo';
import { validateAlbumData,validateNoteData } from '../utils/validators';
import { setAlbumPath } from '../utils/helpers';

//notes

export const addNote = catchAsync(async (req : Request, res : Response) => {
    const { 
        note: {
            title, 
            date, 
            text, 
        },
        profileId 
    } = req.body;

    await validateNoteData(title, text, date);

    const note = await NoteService.Instance.createNote(profileId, title, text, date);

    res.send({ note });
});

export const getNotes = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.params;

    const { notes } = await ProfileService.Instance.getProfileById(parseInt(id));

    res.send({ notes });
});

export const updateNote = catchAsync(async (req : Request, res : Response) => {
    const { 
        id,
        text,
        date,
        title
    } = req.body;

    await validateNoteData(title, text, date, id);
    
    const note = await NoteService.Instance.updateNote(id, {
        text,
        date,
        title
    });

    res.send({ note });
});

export const deleteNote = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;

    await NoteService.Instance.deleteNote(id);

    res.sendStatus(200);
});

//albums

export const addAlbum = catchAsync(async (req : Request, res : Response) => {
    const { 
        profileId,
        title,
        date
    } = req.body;

    await validateAlbumData(title, date);

    const { albums } = await ProfileService.Instance.getProfileById(profileId);

    const isTitleExists = albums.some(album => album.title === title);
    
    if (isTitleExists) {
        throw new AlbumTitleExistenseError();
    }

    const album = await AlbumService.Instance.createAlbum(
        profileId,
        title,
        date
    );

    res.send({ album });
});

export const getAlbums = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.params;

    const { albums } = await ProfileService.Instance.getProfileById(parseInt(id));

    res.send({ albums });
});

export const updateAlbum = catchAsync(async (req : Request, res : Response) => {
    const { 
        id,
        title,
        date
    } = req.body;

    await validateAlbumData(title, date, id);

    const album = await AlbumService.Instance.updateAlbum(id, {
        title,
        date
    });

    res.send({ album });
});

export const updateAlbumBackground = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;

    const { 
        backgroundPhotoId, 
        photos
    } = await AlbumService.Instance.getAlbumById(id);

    const isPhotoFromAlbum = photos.some(photo => photo.imageId === backgroundPhotoId);

    if (!isPhotoFromAlbum) {
        throw new PhotoNotFoundError();
    }

    const album = await AlbumService.Instance.updateAlbum(
        id, 
        { backgroundPhotoId }
    );

    const url = await CloudinaryService.Instance.getImageUrl(backgroundPhotoId);
    
    res.send({
        album: { 
            id: album.id,
            title: album.title,
            date: album.date,
            backgroundUrl : url 
        }
    });
});

export const deleteAlbum = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;

    const album = await AlbumService.Instance.getAlbumById(id);

    const albumPath = setAlbumPath(album.profile.id, album.title);

    const isFolderExists = await CloudinaryService.Instance.deleteFolder(albumPath);

    if (isFolderExists) {
        const ids = await album.photos.map(photo => photo.id);
        await PhotoService.Instance.deletePhotosByIds(ids);
    }

    await AlbumService.Instance.deleteAlbum(id);
    
    res.sendStatus(200);
});

//photos

export const addPhotos = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;
    const photos = req.files; 

    const album = await AlbumService.Instance.getAlbumById(id);

    const savedPhotos = await Promise.all(Object.values(photos).map(async (photo) => {
        const { public_id, url } = await CloudinaryService.Instance.upload(
            {
                folder: setAlbumPath(album.profile.id, album.title)
            }, 
            photo
        );

        const { 
            id: photoId, 
            isFavorite 
        } = await PhotoService.Instance.addPhoto(id, {
            isFavorite: false,
            imageId: public_id
        });

        return {
            id: photoId,
            isFavorite,
            imageUrl: url
        };
    }));

    res.send({
        photos: savedPhotos
    });
});

export const getPhotos = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.params;

    const { photos } = await AlbumService.Instance.getAlbumById(parseInt(id));

    const photosWithUrl = await Promise.all(photos.map(async (photo) => {
        const url = await CloudinaryService.Instance.getImageUrl(photo.imageId);

        photo.imageId = url;

        return {
            ...photo,
            imageId: url
        };
    }));

    res.send({ 
        photos: photosWithUrl
    });
});

export const deletePhoto = catchAsync(async (req : Request, res : Response) => {
    const { id } = req.body;

    const { imageId } = await PhotoService.Instance.getPhotoById(id);

    await CloudinaryService.Instance.delete(imageId);

    await PhotoService.Instance.deletePhotoById(id);

    res.sendStatus(200);
});

export const updatePhotoStatus = catchAsync(async (req : Request, res : Response) => {
    const { id, isFavorite } = req.body;

    const photo = await PhotoService.Instance.updateStatus(id, isFavorite);

    const url = await CloudinaryService.Instance.getImageUrl(photo.imageId);

    res.send({
        id: photo.id,
        isFavorite: photo.isFavorite,
        imageUrl: url
    });
});