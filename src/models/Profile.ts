import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}