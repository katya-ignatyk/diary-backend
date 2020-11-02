import { 
    IEmailService, 
    IJwtService, 
    IProfileService, 
    IUserService 
} from '../../services';
import { IController } from '../interfaces';

export type ISignUpController = IController<ISignUpControllerNames>;

export type ISignUpControllerNames 
  = 'signUp'
  | 'verifySignUp'

export interface ISignUpControllerDependencies {
  UserService : IUserService;
  EmailService : IEmailService;
  JwtService : IJwtService;
  ProfileService : IProfileService;
}