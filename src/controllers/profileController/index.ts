import moment from 'moment';
import { Request, Response } from 'express';
import { AlbumTitleExistenseError } from '../../utils/errors/album';
import { PhotoNotFoundError } from '../../utils/errors/photo';
import { validateAlbumData, validateAlbumDataWithId, validateNoteData, validateNoteDataWithId } from '../../utils/validators';
import { setAlbumPath } from '../../utils/helpers';
import { IAlbumService, ICloudinaryService, INoteService, IPhotoService, IProfileService } from '../../services';
import { IDependencies } from '../../config/awilixContainer';
import { IProfileController } from './interfaces';

export class ProfileController implements IProfileController{
    private noteService : INoteService;
    private albumService : IAlbumService;
    private profileService : IProfileService;
    private cloudinaryService : ICloudinaryService;
    private photoService : IPhotoService;

    constructor (dependencies : IDependencies) {
        this.noteService = dependencies.noteService;
        this.profileService = dependencies.profileService;
        this.albumService = dependencies.albumService;
        this.cloudinaryService = dependencies.cloudinaryService;
        this.photoService = dependencies.photoService;
    }

    async addNote (req : Request, res : Response) {
        const { 
            note: {
                title, 
                date, 
                text, 
            },
            profileId 
        } = req.body;
    
        await validateNoteData(title, text, date);
    
        const note = await this.noteService.createNote(profileId, title, text, date);
    
        res.send({ note });
    }

    async getNotes (req : Request, res : Response) {
        const { id, page } = req.params;

        const count = 4;
        const end = count * parseInt(page); 
        const start = end - count;

        const { notes } = await this.profileService.getProfileById(parseInt(id));

        const sortedArray = notes.sort((first, second) => {
            return moment(second.date).diff(first.date);
        });

        const notePage = sortedArray.slice(start, end);

        const isLastPage = sortedArray.length <= end;

        res.send({ 
            notes: notePage, 
            isLastPage 
        });
    }

    async updateNote (req : Request, res : Response) {
        const { 
            id,
            text,
            date,
            title
        } = req.body;
    
        await validateNoteDataWithId(title, text, date, id);
        
        const note = await this.noteService.updateNote(id, {
            text,
            date,
            title
        });
    
        res.send({ note });
    }

    async deleteNote (req : Request, res : Response) {
        const { id } = req.body;

        await this.noteService.deleteNote(id);

        res.sendStatus(200);
    }

    async addAlbum (req : Request, res : Response) {
        const { 
            album: {
                date,
                title,
            },
            profileId,
    
        } = req.body;
    
        await validateAlbumData(title, date);
    
        const { albums } = await this.profileService.getProfileById(profileId);
    
        const isTitleExists = albums.some(album => album.title === title);
        
        if (isTitleExists) {
            throw new AlbumTitleExistenseError();
        }
    
        const album = await this.albumService.createAlbum(
            profileId,
            title,
            date
        );
    
        res.send({ album });
    }

    async getAlbum (req : Request, res : Response) {
        const { id, page } = req.params;

        const count = 30;
        const end = count * parseInt(page); 
        const start = end - count;

        const album = await this.albumService.getAlbumById(parseInt(id));

        const photosPage = album.photos.slice(start, end);

        const {
            id: albumId, 
            backgroundPhotoId,
            title,
            date
        } = album;

        const photosWithUrl = photosPage.map(photo => {
            const photoUrl = this.cloudinaryService.getImageUrl(photo.imageId);

            const {
                id,
                isFavorite
            } = photo;

            return {
                id,
                imageUrl: photoUrl,
                isFavorite
            };
        });

        const backgroundPhotoUrl = backgroundPhotoId && this.cloudinaryService.getImageUrl(backgroundPhotoId) || '';

        res.send({ album: {
            id: albumId, 
            title, 
            date,
            backgroundPhotoUrl,
            photos: photosWithUrl
        } });
    }

    async getAlbums (req : Request, res : Response) {
        const { id, page } = req.params;

        const count = 4;
        const end = count * parseInt(page); 
        const start = end - count;

        const { albums } = await this.profileService.getProfileById(parseInt(id));

        const sortedArray = albums.sort((first, second) => {
            return moment(second.date).diff(first.date);
        });
    
        const albumPage = sortedArray.slice(start, end);

        const albumsWithBackgroundUrl = albumPage.map(album => {
            const backgroundPhotoUrl = this.cloudinaryService.getImageUrl(album.backgroundPhotoId);

            const photosWithUrl = album.photos.map(photo => {
                const photoUrl = this.cloudinaryService.getImageUrl(photo.imageId);

                const {
                    id,
                    isFavorite
                } = photo;

                return {
                    id,
                    imageUrl: photoUrl,
                    isFavorite
                };
            });

            const {
                id,
                title,
                date
            } = album;

            return {
                id,
                title,
                date,
                backgroundPhotoUrl,
                photos: photosWithUrl
            };
        });

        const isLastPage = sortedArray.length <= end;

        res.send({ albums: albumsWithBackgroundUrl, isLastPage });
    }

    async updateAlbum (req : Request, res : Response) {
        const { 
            id,
            title,
            date
        } = req.body;
    
        await validateAlbumDataWithId(title, date, id);
    
        const album = await this.albumService.updateAlbum(id, {
            title,
            date
        });
    
        res.send({ album });
    }

    async updateAlbumBackground (req : Request, res : Response) {
        const { photoId, id } = req.body;

        const { 
            photos
        } = await this.albumService.getAlbumById(id);

        const isPhotoFromAlbum = photos.some(photo => photo.id === photoId);

        if (!isPhotoFromAlbum) {
            throw new PhotoNotFoundError();
        }

        const { imageId } = await this.photoService.getPhotoById(photoId);

        const album = await this.albumService.updateAlbum(
            id, 
            { backgroundPhotoId: imageId }
        );

        const url = await this.cloudinaryService.getImageUrl(imageId);
    
        res.send({
            album: { 
                id: album.id,
                title: album.title,
                date: album.date,
                backgroundUrl : url 
            }
        });
    }

    async deleteAlbum (req : Request, res : Response) {
        const { id } = req.body;

        const album = await this.albumService.getAlbumById(id);
    
        const albumPath = setAlbumPath(album.profile.id, album.title);
    
        const isFolderExists = await this.cloudinaryService.deleteFolder(albumPath);
    
        if (isFolderExists) {
            const ids = album.photos.map(photo => photo.id);
            await this.photoService.deletePhotosByIds(ids);
        }
    
        await this.albumService.deleteAlbum(id);
        
        res.sendStatus(200);
    }

    async addPhotos (req : Request, res : Response) {
        const { id } = req.body;
        const photos = req.files; 

        const album = await this.albumService.getAlbumById(id);

        const savedPhotos = await Promise.all(Object.values(photos).map(async (photo) => {
            const { public_id, url } = await this.cloudinaryService.upload(
                {
                    folder: setAlbumPath(album.profile.id, album.title)
                }, 
                photo
            );

            const { 
                id: photoId, 
                isFavorite 
            } = await this.photoService.addPhoto(id, {
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
    }

    async getPhotos (req : Request, res : Response) {
        const { id } = req.params;

        const { photos } = await this.albumService.getAlbumById(parseInt(id));

        const photosWithUrl = await Promise.all(photos.map(async (photo) => {
            const url = await this.cloudinaryService.getImageUrl(photo.imageId);

            const { id, isFavorite } = photo;

            return {
                id,
                isFavorite,
                imageUrl: url
            };
        }));

        res.send({ 
            photos: photosWithUrl
        });
    }

    async deletePhoto (req : Request, res : Response) {
        const { id, albumId } = req.body;

        const { imageId } = await this.photoService.getPhotoById(id);

        await this.cloudinaryService.delete(imageId);

        await this.photoService.deletePhotoById(id);

        const album = await this.albumService.getAlbumById(albumId);

        const isBackgroundExists = album.photos.some(photo => photo.imageId === album.backgroundPhotoId);

        !isBackgroundExists && await this.albumService.updateAlbum(
            albumId, 
            {
                backgroundPhotoId: ''
            }
        );

        res.sendStatus(200);
    }

    async updatePhotoStatus (req : Request, res : Response) {
        const { id, isFavorite } = req.body;

        const photo = await this.photoService.updateStatus(id, isFavorite);

        const url = await this.cloudinaryService.getImageUrl(photo.imageId);

        res.send({
            id: photo.id,
            isFavorite: photo.isFavorite,
            imageUrl: url
        });
    }
}