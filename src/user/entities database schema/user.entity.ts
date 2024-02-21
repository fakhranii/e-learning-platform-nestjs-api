import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

//* table name
@Entity({ name: 'users'}) 
export class User {

    //* table schema
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