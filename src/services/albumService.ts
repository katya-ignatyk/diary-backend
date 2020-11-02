import { DeleteResult, getRepository } from 'typeorm';
import { Album } from '../models';
import { AlbumNotFoundError } from '../utils/errors/album';
import { BaseService } from './baseService';
import { IProfileService } from './profileService';

export interface IAlbumService extends BaseService<Album> {
    createAlbum(profileId : number, title : string, date : Date) : Promise<Album>;
    updateAlbum(id : number, data : Partial<Album>) : Promise<Album>;
    deleteAlbum(id : number) : Promise<DeleteResult>;
    getAlbumById(id : number) : Promise<Album>;
}

interface IAlbumServiceDependencies {
    ProfileService : IProfileService;
}

export class AlbumService extends BaseService<Album> {
    private ProfileService : IProfileService;

    constructor({ ProfileService } : IAlbumServiceDependencies) {
        super(getRepository(Album));

        this.ProfileService = ProfileService;

        this.createAlbum = this.createAlbum.bind(this);

    }

    public async createAlbum(profileId : number, title : string, date : Date) {
        const album = await this.save({
            title,
            date,
        });

        const profile = await this.ProfileService.getProfileById(profileId);
        profile.albums = [...profile.albums, album];

        await this.ProfileService.save(profile);

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
            relations: ['profile', 'photos'],
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