import { DeleteResult, getRepository } from 'typeorm';
import { IDependencies } from '../config/awilixContainer';
import { Photo } from '../models';
import { PhotoNotFoundError } from '../utils/errors/photo';
import { IAlbumService } from './albumService';
import { BaseService } from './baseService';

export interface IPhotoService extends BaseService<Photo> {
    addPhoto(albumId : number, image : Partial<Photo>) : Promise<Photo>;
    getPhotoById(id : number) : Promise<Photo>;
    deletePhotoById(id : number) : Promise<DeleteResult>;
    deletePhotosByIds(ids : number[]) : Promise<DeleteResult>;
    updateStatus(id : number, isFavorite : boolean) : Promise<Photo>;
}

export class PhotoService extends BaseService<Photo> implements IPhotoService {

    private albumService : IAlbumService;

    constructor({ albumService } : IDependencies) {
        super(getRepository(Photo));

        this.albumService = albumService;

        this.addPhoto = this.addPhoto.bind(this);
    }

    public async addPhoto(albumId : number, image : Partial<Photo>) {
        const photo = await this.save(image);
        const album = await this.albumService.getAlbumById(albumId);
      
        album.photos = [...album.photos, photo];

        await this.albumService.save(album);

        return photo;
    }

    public async getPhotoById(id : number) {
        const photo = await this.findOne({ id });

        if (!photo) {
            throw new PhotoNotFoundError();
        }

        return photo;
    }

    public async deletePhotoById(id : number) {
        return this.delete(id);
    }

    public async deletePhotosByIds(ids : number[]) {
        return this.delete(ids);
    }

    public async updateStatus(id : number, isFavorite : boolean) {
        await this.update({ id }, {
            isFavorite
        });

        return this.getPhotoById(id);
    }
 
}