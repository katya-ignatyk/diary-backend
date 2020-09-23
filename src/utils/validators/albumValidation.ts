import Joi from '@hapi/joi';
import { AlbumValidationError } from '../errors/album';

const albumErrors = Joi.object({
    title: Joi.string()
        .required(),
    date: Joi.date()
        .required()
}); 

const albumErrorsWithId = Joi.object({
    title: Joi.string()
        .required(),
    date: Joi.date()
        .required(),
    id: Joi.number()
        .required()
}); 

export function validateAlbumData(title : string, date : Date, id ?: number) {

    const error = (id && albumErrorsWithId.validate({ title, date, id }).error) || albumErrors.validate({ title, date }).error;

    if (error) {
        throw new AlbumValidationError(error.message);
    }
}