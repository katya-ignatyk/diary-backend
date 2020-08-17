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

  public async saveProfileChanges(userId : number, girl_name : string, girl_age : number, boy_name : string, boy_age : number) {
      const user = await UserService.Instance.getUserById(userId);

      if (user.profile) {
          await this.update(
              { id: user.profile.id }, 
              { girl_name, girl_age, boy_name, boy_age }
          );
          return this.findOne({ id: user.profile.id });
      }
      else {
          return this.createProfile(userId, girl_name, girl_age, boy_name, boy_age);
      }
  }

  public async checkProfileExistence(id : number) {
      const user = await UserService.Instance.getUserById(id);

      if (!user.profile) {
          throw new ProfileNotFoundError();
      }
      
      return user.profile;
  }

  public async createProfile(userId : number, girl_name : string, girl_age : number, boy_name : string, boy_age : number) {
      const profile = await this.save({ 
          girl_name, 
          girl_age, 
          boy_age, 
          boy_name 
      }); 
      UserService.Instance.update({ id: userId }, { profile });
      return profile; 
  }
}