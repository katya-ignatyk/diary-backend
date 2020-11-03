import Joi from '@hapi/joi';
import { AlbumValidationError } from '../errors/album';

const albumSchema = Joi.object({
    title: Joi.string()
        .required(),
    date: Joi.date()
        .required()
}); 

const albumSchemaWithId = Joi.object({
    title: Joi.string()
        .required(),
    date: Joi.date()
        .required(),
    id: Joi.number()
        .required()
}); 

export function validateAlbumData(title : string, date : Date) {

    const error = albumSchema.validate({ title, date }).error;

    if (error) {
        throw new AlbumValidationError(error.message);
    }
}

export function validateAlbumDataWithId(title : string, date : Date, id : number) {

    const error = albumSchemaWithId.validate({ title, date, id }).error;

    if (error) {
        throw new AlbumValidationError(error.message);
    }
}