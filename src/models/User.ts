import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './Profile';

export enum UserStatus {
    PENDING = 'PENDING',
    VERIFY = 'VERIFY'
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({ unique: true })
    email! : string;
    
    @Column()
    password! : string;

    @Column()
    username! : string;

    @Column({ enum : UserStatus })
    status! : UserStatus

    @OneToOne(type => Profile)
    @JoinColumn()
    profile! : Profile
}