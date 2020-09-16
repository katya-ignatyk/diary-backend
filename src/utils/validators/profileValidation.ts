import Joi from '@hapi/joi';
import { ProfileValidationError } from '../errors/profile';

const profileErrors = Joi.object({
    girl_name: Joi.string()
        .required(),
    girl_age: Joi.number()
        .required()
        .min(1)
        .max(100),
    boy_name: Joi.string()
        .required(),
    boy_age: Joi.number()
        .required()
        .min(1)
        .max(100),
    id: Joi.number()
        .required()
}); 

export function validateProfileData(girl_name : string, girl_age : number, boy_name : string, boy_age : number, id : number) {

    const error = profileErrors.validate({ girl_name, girl_age, boy_name, boy_age, id }).error;

    if (error) {
        throw new ProfileValidationError(error.message);
    }
}