import Database from "better-sqlite3";
import { CreateDatabase } from "./createDb";


export interface InterfaceCreateUser{
    name:string;
    email:string;
    password:string;
}

export interface AddressUser {
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
        const create = new CreateDatabase()
        create.create()
        this.db = new CreateDatabase().db
    }

    insertUser({name,email,password}:InterfaceCreateUser){

        return this.db.prepare(/*SQL */ `
            INSERT OR IGNORE INTO "data_user" (
                "name","email","password"
            ) VALUES (?,?,?)
        `).run(name,email,password,)
    }
    selectUser({email}:{email:string}){
         return this.db.prepare(/*SQL */ `
           SELECT "id","email","password" FROM "data_user"
           WHERE "email" = ?
        `).get(email) as {email:string,id:number,password:string}
    }
    insertSession({session_hash,user_id}:{session_hash:string,user_id:number;}){
         return this.db.prepare(/*SQL */ `
          INSERT OR IGNORE INTO "sessions"
          (
            "session_hash","user_id","revoked"
          )
          VALUES (?,?,?)

        `).run(session_hash,user_id,0)
    }
    updateUserData({name,email,password}:updateUser & {name:string}){
        return this.db.prepare(/*SQL */`
        
            UPDATE  "data_user" 
            SET "name" = ?, "email" = ?, "password" = ?
            WHERE "email" = ?
            
        `).run(name,email,password,email)
    }
    selectSession({sid_hash}:{sid_hash:string}){
        return this.db.prepare(/*sql */`
        
            SELECT "u"."name","u"."email","u"."id" FROM "sessions" AS "s" 
            INNER JOIN "data_user" AS "u" ON "s"."user_id" = "u"."id"
            WHERE "s"."session_hash" = ?
        `).get(sid_hash) as {name:string,email:string,id:number}
    }
    selectSessionEmail({email}:{email:string}){
        console.log({email})
        return this.db.prepare(/*SQL */ `
        
            SELECT "revoked" FROM "sessions" AS "s"
            WHERE "s"."user_id" = (SELECT "id" FROM "data_user" WHERE "email" = ?)
            
        `).get(email) as {revoked:number}
    }
    revokedSession({email}:{email:string}){


        return this.db.prepare(/*SQL */`   
            UPDATE "sessions" AS "s"
            SET "revoked" = ?
            FROM "data_user" AS "u" 
            WHERE "u"."id" = "s"."user_id" AND  "email" = ?
            
        `).run(1,email)
        
    }
    selectAllDados({email}:{email:string}){
        return this.db.prepare(/*sql */`
        
            SELECT "name","email","cep","cidade","estado","numero","rua" FROM "data_user"
            INNER JOIN "address_user" ON "data_user"."id" = "address_user"."id"  
            WHERE "email" = ?
        `).get(email) as {name:string,email:string,cep:string,cidade:string,estado:string,numero:string,rua:string}
    }
    insertAddress({cep,cidade,estado,numero,rua}:AddressUser){
        return this.db.prepare(/*SQL */`
            
            INSERT OR IGNORE INTO "address_user"
            ("cep","cidade","estado","numero","rua")
            VALUES (?,?,?,?,?)
            
        `).run(cep,cidade,estado,numero,rua)
    }
    updateAddress({cep,cidade,estado,numero,rua,user_id}:AddressUser & {user_id:number}){
        console.log(user_id)
         return this.db.prepare(/*SQL */`
        
            UPDATE  "address_user" 
            SET "cep" = ?, "cidade" = ?, "estado" = ?,
            "numero" = ?, "rua" = ?
            WHERE "id" = ?
            
        `).run(cep,cidade,estado,numero,rua,user_id)
    }
}