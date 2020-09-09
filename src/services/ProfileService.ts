import { getRepository } from 'typeorm';
import { Profile } from '../models';
import { ProfileNotFoundError } from '../utils/errors/profileErrors';
import { BaseService } from './baseService';
import { UserService } from './userService';

export class ProfileService extends BaseService<Profile> {
  private static instance : ProfileService;

  constructor() {
      super(getRepository(Profile));
  }

  public static get Instance() : ProfileService {
      if (!ProfileService.instance)
          ProfileService.instance = new ProfileService();
      return ProfileService.instance;
  }

  public async getProfileById(id : number) {
      const profile = await this.findOne({ 
          relations: ['notes'],
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

      return this.findOne({ id });
  }

  public async create(userId : number, girl_name : string, girl_age : number, boy_name : string, boy_age : number, avatarId : string) {
      const profile = await this.save({ 
          girl_name, 
          girl_age, 
          boy_age, 
          boy_name,
          avatarId
      }); 
      
      UserService.Instance.update({ id: userId }, { profile });
      return profile; 
  }
}