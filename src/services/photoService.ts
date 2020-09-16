import { getRepository } from 'typeorm';
import { Photo } from '../models';
import { PhotoNotFoundError } from '../utils/errors/photo';
import { BaseService } from './baseService';
import { AlbumService } from './albumService';

export class PhotoService extends BaseService<Photo> {
  private static instance : PhotoService;

  constructor() {
      super(getRepository(Photo));
  }

  public static get Instance() : PhotoService {
      if (!PhotoService.instance)
          PhotoService.instance = new PhotoService();
      return PhotoService.instance;
  }

  public async addPhoto(albumId : number, image : Partial<Photo>) {
      const photo = await this.save(image);
      const album = await AlbumService.Instance.getAlbumById(albumId);
      album.photos = [...album.photos, photo];

      await AlbumService.Instance.save(album);

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