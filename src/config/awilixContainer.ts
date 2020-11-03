import { asClass, asFunction, asValue, createContainer } from 'awilix';
import { Router } from 'express';
import multer from 'multer';
import {
    profileRoutes,
    settingsRoutes,
    signInRoutes,
    signUpRoutes,
    router
} from '../routes';
import { 
    SettingsController,
    ISettingsController,
    ProfileController,
    IProfileController,
    SignInController,
    ISignInController,
    SignUpController,
    ISignUpController
} from '../controllers';
import { 
    ProfileService,
    IProfileService,
    AlbumService,
    IAlbumService,
    CloudinaryService,
    ICloudinaryService,
    EmailService,
    IEmailService,
    JwtService,
    IJwtService,
    NoteService,
    INoteService,
    PhotoService,
    IPhotoService,
    UserService,
    IUserService
} from '../services';
import { createConnectionWithDB } from '../utils/createConnectionWithDB';
import { App } from '../';
import { uploader } from '../config';

export interface IDependencies {
   router : Router;

   profileController : IProfileController;
   settingsController : ISettingsController;
   signInController : ISignInController;
   signUpController : ISignUpController;
   
   noteService : INoteService;
   albumService : IAlbumService;
   profileService : IProfileService;
   cloudinaryService : ICloudinaryService;
   photoService : IPhotoService;
   emailService : IEmailService;
   userService : IUserService;
   jwtService : IJwtService;

   uploader : multer.Multer;
       
}

const container = createContainer();

async function setupContainer () {
    await createConnectionWithDB();

    container.register({

        //app

        app: asClass(App).singleton(),
        router: asFunction(router).singleton(),
        uploader: asValue(uploader),

        //routes

        profileRoutes: asFunction(profileRoutes).singleton(),
        settingsRoutes: asFunction(settingsRoutes).singleton(),
        signInRoutes: asFunction(signInRoutes).singleton(),
        signUpRoutes: asFunction(signUpRoutes).singleton(),

        //controllers

        settingsController: asClass(SettingsController).singleton(),
        profileController: asClass(ProfileController),
        signInController: asClass(SignInController).singleton(),
        signUpController: asClass(SignUpController).singleton(),
        
        //services
        
        profileService: asClass(ProfileService).singleton(),
        albumService: asClass(AlbumService).singleton(),
        cloudinaryService: asClass(CloudinaryService).singleton(),
        emailService: asClass(EmailService).singleton(),
        jwtService: asClass(JwtService).singleton(),
        noteService: asClass(NoteService).singleton(),
        photoService: asClass(PhotoService).singleton(),
        userService: asClass(UserService).singleton(),

    });
}

export { container, setupContainer };