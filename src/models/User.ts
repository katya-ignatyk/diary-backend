import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserStatus {
    PENDING = 'PENDING',
    VERIFY = 'VERIFY'
}

@Entity('user')
export class User{
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
}