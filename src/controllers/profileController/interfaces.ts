import { IController } from '../interfaces';

export type IProfileController = IController<IProfileControllerNames>;

export type IProfileControllerNames
    = 'addNote' 
    | 'getNotes'
    | 'updateNote'
    | 'deleteNote'
    | 'addAlbum'
    | 'getAlbum'
    | 'getAlbums'
    | 'updateAlbum'
    | 'updateAlbumBackground'
    | 'deleteAlbum'
    | 'addPhotos'
    | 'getPhotos'
    | 'deletePhoto'
    | 'updatePhotoStatus'