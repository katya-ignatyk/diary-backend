import Joi from '@hapi/joi';
import { UserVallidationError } from '../errors/userErrors';

const inputErrors = Joi.object({
    password: Joi.string()
        .required()
        .min(8),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
        .required(),
    
    username: Joi.string()
        .min(3)
        .max(20)
        .required(),
}); 

export async function validateUserData(email : string, password : string, username : string){
    const error = inputErrors.validate({ email, password, username }).error;
    if(error){
        throw new UserVallidationError(error.message);
    }
}