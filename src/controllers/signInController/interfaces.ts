import { IController } from '../interfaces';

export type ISignInController = IController<ISignInControllerNames>;

export type ISignInControllerNames 
 = 'signIn'
 | 'forgotPassword'
 | 'resetPassword'
 | 'fetchUser'
 | 'auth'