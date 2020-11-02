import { 
    ICloudinaryService, 
    IEmailService, 
    IJwtService, 
    IProfileService, 
    IUserService 
} from '../../services';
import { IController } from '../interfaces';

export type ISignInController = IController<ISignInControllerNames>;

export type ISignInControllerNames 
 = 'signIn'
 | 'forgotPassword'
 | 'resetPassword'
 | 'fetchUser'
 | 'auth'

export interface ISignInControllerDependencies {
  UserService : IUserService;
  JwtService : IJwtService;
  EmailService : IEmailService;
  ProfileService : IProfileService;
  CloudinaryService : ICloudinaryService;
}