import { getRepository } from 'typeorm';
import { Album } from '../models';
import { AlbumNotFoundError } from '../utils/errors/album';
import { BaseService } from './baseService';
import { ProfileService } from './profileService';

export class AlbumService extends BaseService<Album> {
  private static instance : AlbumService;

  constructor() {
      super(getRepository(Album));
  }

  public static get Instance() : AlbumService {
      if (!AlbumService.instance)
          AlbumService.instance = new AlbumService();
      return AlbumService.instance;
  }

  public async createAlbum(profileId : number, title : string, date : Date) {
      const album = await this.save({
          title,
          date,
      });

      const profile = await ProfileService.Instance.getProfileById(profileId);
      profile.albums = [...profile.albums, album];

      await ProfileService.Instance.save(profile);

      return album;
  }

  public async updateAlbum(id : number, data : Partial<Album>) {
      await this.update({ id }, data);

      return this.getAlbumById(id);
  }

  public async deleteAlbum(id : number) {
      const deleteResult = await this.delete({ id });

      if (deleteResult.affected === 0) {
          throw new AlbumNotFoundError();
      }

      return deleteResult;
  }

  public async getAlbumById(id : number) {
      const album = await this.findOne({ 
          relations: ['profile'],
          where: {
              id
          }
      });

      if (!album) {
          throw new AlbumNotFoundError();
      }

      return album;
  }

}