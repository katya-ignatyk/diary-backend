import { asClass, asFunction, asValue, createContainer } from 'awilix';
import {
    profileRoutes,
    settingsRoutes,
    signInRoutes,
    signUpRoutes,
    router
} from '../routes';
import { 
    SettingsController,
    ProfileController,
    SignInController,
    SignUpController
} from '../controllers';
import { 
    ProfileService,
    AlbumService,
    CloudinaryService,
    EmailService,
    JwtService,
    NoteService,
    PhotoService,
    UserService
} from '../services';
import { createConnectionWithDB } from '../utils/createConnectionWithDB';
import { App } from '../';
import * as config from '../config';
import { 
    Album,
    Note,
    Photo,
    Profile,
    User 
} from '../models';

const container = createContainer();

async function setupContainer () {
    await createConnectionWithDB();

    container.register({

        //app

        app: asClass(App).singleton(),
        router: asFunction(router).singleton(),
        config: asValue(config),

        //routes

        profileRoutes: asFunction(profileRoutes).singleton(),
        settingsRoutes: asFunction(settingsRoutes).singleton(),
        signInRoutes: asFunction(signInRoutes).singleton(),
        signUpRoutes: asFunction(signUpRoutes).singleton(),

        //controllers

        SettingsController: asClass(SettingsController).singleton(),
        ProfileController: asClass(ProfileController).singleton(),
        SignInController: asClass(SignInController).singleton(),
        SignUpController: asClass(SignUpController).singleton(),
        
        //services
        
        ProfileService: asClass(ProfileService).singleton(),
        AlbumService: asClass(AlbumService).singleton(),
        CloudinaryService: asClass(CloudinaryService).singleton(),
        EmailService: asClass(EmailService).singleton(),
        JwtService: asClass(JwtService).singleton(),
        NoteService: asClass(NoteService).singleton(),
        PhotoService: asClass(PhotoService).singleton(),
        UserService: asClass(UserService).singleton(),

        //models

        Album: asValue(Album),
        Note: asValue(Note),
        Photo: asValue(Photo),
        Profile: asValue(Profile),
        User: asValue(User)

    });
}

export { container, setupContainer };