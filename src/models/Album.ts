import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Profile } from './Profile';
import { Photo } from './Photo';

@Entity('album')
export class Album {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    title! : string;

    @Column()
    date! : Date;

    @Column({ nullable: true })
    backgroundPhotoId! : string;

    @ManyToOne(() => Profile, (profile) => profile.albums)
    profile! : Profile;

    @ManyToMany(() => Photo)
    @JoinTable()
    photos! : Photo[];
}