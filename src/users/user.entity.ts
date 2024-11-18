import { Exclude } from "class-transformer";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    email:string

    @Column()
    password:string

    @AfterInsert()
    logInsert(){
        console.log("User has been inserted: ",this.id )
    }

    @AfterUpdate()
    logUpdate(){
        console.log("User has been updated: ",this.id )
    }

    @AfterRemove()
    logDelete(){
        console.log("User has been deleted: ",this.id )
    }
}