import { Column, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Note } from './Note';

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    girl_name! : string;

    @Column()
    girl_age! : number;
    
    @Column()
    boy_name! : string;

    @Column()
    boy_age! : number;

    @Column()
    avatarId! : string;

    @OneToMany(() => Note, (notes) => notes.profile)
    notes! : Note[];
}