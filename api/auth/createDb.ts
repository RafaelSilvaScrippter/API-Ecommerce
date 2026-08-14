import Database from "better-sqlite3";
import { TableAuth } from "./tablesAuth";

export class CreateDatabase{
    db:Database.Database;
    constructor(){
        this.db = new Database('./api/auth/db.sqlite')
    }


    create(){
        this.db.exec(TableAuth)
    }
}
