import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'users'}) // table name
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    username: string;

    @Column({ unique: true})
    email: string;

    @Column() // typeorm package 
    password: string;

    @Column({ default: false })
    isAdmin: boolean; // true or false

}