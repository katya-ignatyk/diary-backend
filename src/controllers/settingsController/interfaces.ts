import { ICloudinaryService, IProfileService } from '../../services';
import { IController } from '../interfaces';

export type ISettingsController = IController<ISettingsControllerNames>;

export type ISettingsControllerNames 
  = 'getProfile'
  | 'updateAvatar'
  | 'deleteAvatar'
  | 'updateProfile'

export interface ISettingsControllerDependencies {
  ProfileService : IProfileService;
  CloudinaryService : ICloudinaryService;
}
  