import { 
    IPhotoService, 
    ICloudinaryService, 
    IProfileService,
    IAlbumService,
    INoteService 
} from '../../services';
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
    
export interface IProfileControllerDependencies {
    NoteService : INoteService;
    AlbumService : IAlbumService;
    ProfileService : IProfileService;
    CloudinaryService : ICloudinaryService;
    PhotoService : IPhotoService;
}
  