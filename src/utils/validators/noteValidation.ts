import Joi from '@hapi/joi';
import { NoteValidationError } from '../errors/note';

const noteSchema = Joi.object({
    title: Joi.string()
        .required(),
    text: Joi.string()
        .required(),
    date: Joi.date()
        .required()
}); 

const noteSchemaWithId = Joi.object({
    title: Joi.string()
        .required(),
    text: Joi.string()
        .required(),
    date: Joi.date()
        .required(),
    id: Joi.number()
        .required()
}); 

export function validateNoteData(title : string, text : string, date : Date) {

    const error = noteSchema.validate({ title, text, date }).error;

    if (error) {
        throw new NoteValidationError(error.message);
    }
}

export function validateNoteDataWithId(title : string, text : string, date : Date, id : number) {

    const error = noteSchemaWithId.validate({ title, text, date, id }).error;

    if (error) {
        throw new NoteValidationError(error.message);
    }
}