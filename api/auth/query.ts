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

export class QueryAuth{
    db:Database.Database;
    constructor(){
        const create = new CreateDatabase().create()
        this.db = new CreateDatabase().db
    }

    insertUser({name,email,password,cep,cidade,estado,numero,rua}:InterfaceCreateUser){
        console.log(name)
        const dados = this.db.prepare(/*SQL */ `
            INSERT OR IGNORE INTO "users" (
                "name","email","password",
                "cep","cidade","estado",
                "numero","rua"
            ) VALUES (?,?,?,?,?,?,?,?)
        `).run(name,email,password,cep,cidade,estado,numero,rua)
        console.log('Dados do insert User',dados)
    }
}