import Joi from '@hapi/joi';
import { NoteValidationError } from '../errors/note';

const noteErrors = Joi.object({
    title: Joi.string()
        .required(),
    text: Joi.string()
        .required(),
    date: Joi.date()
        .required()
}); 

const noteErrorsWithId = Joi.object({
    title: Joi.string()
        .required(),
    text: Joi.string()
        .required(),
    date: Joi.date()
        .required(),
    id: Joi.number()
        .required()
}); 

export function validateNoteData(title : string, text : string, date : Date, id ?: number) {

    const error = (id && noteErrorsWithId.validate({ title, text, date, id }).error) || noteErrors.validate({ title, text, date }).error;

    if (error) {
        throw new NoteValidationError(error.message);
    }
}