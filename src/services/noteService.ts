import { DeleteResult, getRepository } from 'typeorm';
import { Note } from '../models';
import { NoteNotFoundError } from '../utils/errors/note';
import { BaseService } from './baseService';
import { IProfileService } from './profileService';

export interface INoteService extends BaseService<Note>{
    createNote(profileId : number, title : string, text : string, date : Date) : Promise<Note>;
    updateNote(id : number, data : Partial<Note>) : Promise<Note>;
    deleteNote(id : number) : Promise<DeleteResult>;
}

interface INoteServiceDependencies {
    ProfileService : IProfileService;
}

export class NoteService extends BaseService<Note> {
    private ProfileService : IProfileService;

    constructor({ ProfileService } : INoteServiceDependencies) {
        super(getRepository(Note));

        this.ProfileService = ProfileService;

        this.createNote = this.createNote.bind(this);
    }

    public async createNote(profileId : number, title : string, text : string, date : Date) {
        const note = await this.save({
            date,
            title,
            text
        });

        const profile = await this.ProfileService.getProfileById(profileId);
        profile.notes = [ ...profile.notes, note ];

        await this.ProfileService.save(profile);

        return note;

    }

    public async updateNote(id : number, data : Partial<Note>) {
        await this.update({ id }, data);

        const note = await this.findOne({ id });

        if (!note) {
            throw new NoteNotFoundError();
        }

        return note;
    }

    public async deleteNote(id : number) {
        const deleteResult = await this.delete({ id });

        if (deleteResult.affected === 0) {
            throw new NoteNotFoundError();
        }

        return deleteResult;
    }
}