import { IController } from '../interfaces';

export type ISignUpController = IController<ISignUpControllerNames>;

export type ISignUpControllerNames 
  = 'signUp'
  | 'verifySignUp'