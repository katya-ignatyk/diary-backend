import { IController } from '../interfaces';

export type ISettingsController = IController<ISettingsControllerNames>;

export type ISettingsControllerNames 
  = 'getProfile'
  | 'updateAvatar'
  | 'deleteAvatar'
  | 'updateProfile'