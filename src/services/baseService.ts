import { Repository, ObjectLiteral, FindOneOptions, DeleteResult } from 'typeorm';

export class BaseService<E extends ObjectLiteral> {
    constructor(protected repository : Repository<E>) {
    }

    public findOne(option : Partial<E> | FindOneOptions<E>) : Promise<E | undefined> {
        return this.repository.findOne(option); 
    }

    public update(criteria : Partial<E>, partialEntity : Partial<E>) : Promise<unknown> {
        return this.repository.update(criteria, partialEntity); 
    }

    public save(entity : Partial<E>) : Promise<E> {
        return this.repository.save(entity); 
    } 

    public delete(criteria : Partial<E> | number | number[]) : Promise<DeleteResult> {
        return this.repository.delete(criteria); 
    }
}