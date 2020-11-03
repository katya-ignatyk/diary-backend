import { getRepository } from 'typeorm';
import { IDependencies } from '../config/awilixContainer';
import { Profile } from '../models';
import { ProfileNotFoundError } from '../utils/errors/profile';
import { BaseService } from './baseService';
import { IUserService } from './userService';

export interface IProfileService extends BaseService<Profile> {
    getProfileById(id : number) : Promise<Profile>; 
    create(userId : number, girl_name : string, girl_age : number, boy_name : string, boy_age : number, avatarId : string) : Promise<Profile>;
    updateProfile (id : number, data : Partial<Profile>) : Promise<Profile>;
}

export class ProfileService extends BaseService<Profile> implements IProfileService {
  private userService : IUserService;
  
  constructor({ userService } : IDependencies) {
      super(getRepository(Profile));

      this.userService = userService;

      this.create = this.create.bind(this);
      this.getProfileById = this.getProfileById.bind(this);
  }

  public async create(userId : number, girl_name : string, girl_age : number, boy_name : string, boy_age : number, avatarId : string) {
      const profile = await this.save({ 
          girl_name, 
          girl_age, 
          boy_age, 
          boy_name,
          avatarId
      }); 
    
      await this.userService.update({ id: userId }, { profile });
      return profile; 
  }

  public async getProfileById(id : number) {
      const profile = await this.findOne({ 
          relations: ['notes', 'albums', 'albums.photos'],
          where: {
              id
          }
      });
      
      if (!profile) {
          throw new ProfileNotFoundError();
      }
      return profile;
  }

  public async updateProfile (id : number, data : Partial<Profile>) {
      await this.update(
          { id }, 
          data
      );

      return this.getProfileById(id);
  }
}