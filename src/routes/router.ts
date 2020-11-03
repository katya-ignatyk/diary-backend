import { Router } from 'express';

export type IRouter<T extends string> = {
    [key in T] : () => Router;
}

export type IRouterNames 
    = 'profileRoutes'
    | 'settingsRoutes'
    | 'signInRoutes'
    | 'signUpRoutes'
  
export const router = ({
    profileRoutes,
    settingsRoutes,
    signInRoutes,
    signUpRoutes
} : IRouter<IRouterNames>) => {
    const router = Router();

    router.use('/profile', profileRoutes);
    router.use('/settings', settingsRoutes);
    router.use('/', signInRoutes);
    router.use('/signUp', signUpRoutes);

    return router;
};