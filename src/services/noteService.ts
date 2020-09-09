import { getRepository } from 'typeorm';
import { Note } from '../models';
import { BaseService } from './baseService';
import { ProfileService } from './profileService';

export class NoteService extends BaseService<Note> {
  private static instance : NoteService;

  constructor() {
      super(getRepository(Note));
  }

  public static get Instance() : NoteService {
      if (!NoteService.instance)
          NoteService.instance = new NoteService();
      return NoteService.instance;
  }

  public async createNote(profileId : number, title : string, text : string, date : Date) {
      const note = await this.save({
          date,
          title,
          text
      });

      const profile = await ProfileService.Instance.getProfileById(profileId);
      profile.notes = [ ...profile.notes, note ];

      await ProfileService.Instance.save(profile);

      return note ;

  }

  public async updateNote(id : number, data : Partial<Note>) {
      await this.update({ id }, data);

      return this.findOne({ id });
  }

  public deleteNote(id : number) {
      return this.delete({ id });
  }
}