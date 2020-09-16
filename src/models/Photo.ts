import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('photo')
export class Photo {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    imageId! : string;
    
    @Column() 
    isFavorite! : boolean;
}