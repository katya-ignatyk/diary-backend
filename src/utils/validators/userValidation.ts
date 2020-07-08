import Joi from '@hapi/joi';
import { UserVallidationError } from '../errors/userErrors';

const inputErrors = Joi.object({
    password: Joi.string()
        .required()
        .min(8),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
}); 

export async function validateUserData(email : string, password : string){
    const error = inputErrors.validate({ email, password }).error;
    if(error){
        throw new UserVallidationError(error.message);
    }
}