import { Request, Response } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { NoteService, ProfileService } from '../services';

export const addNote = catchAsync(async (req : Request, res : Response) => {
    const { 
        note: {
            title, 
            date, 
            text, 
        },
        profileId 
    } = req.body;

    const note = await NoteService.Instance.createNote(profileId, title, text, date);

    res.send({ note });
});

export const getNotes = catchAsync(async (req : Request, res : Response) => {
    const { profileId } = req.body;

    const { notes } = await ProfileService.Instance.getProfileById(profileId);

    res.send({ notes });
});

export const updateNote= catchAsync(async (req : Request, res : Response) => {
    const { 
        id,
        text,
        date,
        title
    } = req.body;

    const note = await NoteService.Instance.updateNote(id, {
        text,
        date,
        title
    });

    res.send({ note });
});

export const deleteNote = catchAsync(async (req : Request, res : Response) => {
    const { 
        id,
        profileId
    } = req.body;

    await NoteService.Instance.deleteNote(id);

    const { notes } = await ProfileService.Instance.getProfileById(profileId);

    res.send({ notes });
});