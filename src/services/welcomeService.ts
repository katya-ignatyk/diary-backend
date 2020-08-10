import { getRepository } from 'typeorm';
import { Profile } from '../models';
import { UserNotFoundError } from '../utils/errors/userErrors';
import { ProfileNotFoundError } from '../utils/errors/profileErrors';
import { BaseService } from './baseService';
import { UserService } from './userService';

export class WelcomeService extends BaseService<Profile> {
  private static instance : WelcomeService;

  constructor() {
      super(getRepository(Profile));
  }

  public static get Instance() : WelcomeService {
      if (!WelcomeService.instance)
          WelcomeService.instance = new WelcomeService();
      return WelcomeService.instance;
  }

  public async createProfile(id : number, girl_name : string, girl_age : number, boy_name : string, boy_age : number) {
      const profile = await this.save({ 
          girl_name, 
          girl_age, 
          boy_age, 
          boy_name 
      }); 
      UserService.Instance.update({ id }, { profile });
      return profile;
  }

  public async checkProfileExistence(id : number) {
      const user = await UserService.Instance.findOne({ 
          relations: ['profile'],
          where: {
              id
          }
      });

      if (!user) {
          throw new UserNotFoundError();
      }

      if (!user.profile) {
          throw new ProfileNotFoundError();
      }
      
      return user.profile;
  }
}