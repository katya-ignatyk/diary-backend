import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Profile } from './Profile';

@Entity('note')
export class Note {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    title! : string;

    @Column()
    text! : string;

    @Column()
    date! : Date;

    @ManyToOne(() => Profile, (profile) => profile.notes)
    profile! : Profile;
}