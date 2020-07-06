import Joi from '@hapi/joi';
import { UserVallidationError } from '../errors/UserErrors/';
import { UserService } from '../../services/';

export async function validateUserData(email : string, password : string){
    const error = inputErrors.validate({email, password}).error;
    if(error)
        throw new UserVallidationError(error.message);
}

const inputErrors = Joi.object({
    password: Joi.string()
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
}) 
