import Database from "better-sqlite3";
import { CreateDatabase } from ".";

export interface InterfaceCreateUser{
    name:string;
    email:string;
    password:string;
    cep?:string;
    cidade?:string;
    estado?:string;
    numero?:string;
    rua?:string
}

type updateUser = Omit<InterfaceCreateUser,'name'>

export class QueryAuth{
    db:Database.Database;
    constructor(){
        const create = new CreateDatabase().create()
        this.db = new CreateDatabase().db
    }

    insertUser({name,email,password,cep,cidade,estado,numero,rua}:InterfaceCreateUser){

        return this.db.prepare(/*SQL */ `
            INSERT OR IGNORE INTO "users" (
                "name","email","password",
                "cep","cidade","estado",
                "numero","rua"
            ) VALUES (?,?,?,?,?,?,?,?)
        `).run(name,email,password,cep,cidade,estado,numero,rua)
    }
    selectUser({email}:{email:string}){
         return this.db.prepare(/*SQL */ `
           SELECT "email","password" FROM "users"
           WHERE "email" = ?
        `).get(email) as {email:string,id:number,password:string}
    }
    insertSession({session_hash,user_id}:{session_hash:string,user_id:number;}){
         return this.db.prepare(/*SQL */ `
          INSERT OR IGNORE INTO "sessions"
          (
            "session_hash","user_id"
          )
          VALUES (?,?)

        `).run(session_hash,user_id)
    }
    updateUserData({name,email,password,cep,cidade,estado,numero,rua}:updateUser & {name:string}){
        return this.db.prepare(/*SQL */`
        
            UPDATE  "users" 
                SET "name" = ?, "email" = ?, "password" = ?,
               "cep" = ?, "cidade" = ?,
               "estado" = ?, "numero" = ?, "rua" = ?
            WHERE "email" = ?
            
        `).run(name,email,password,cep,cidade,estado,numero,rua,email)
    }
}