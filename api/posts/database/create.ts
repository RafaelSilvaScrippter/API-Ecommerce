import Database from "better-sqlite3";
import { createTablesProducts } from "./tables";

export class CreateDb{
    db:Database.Database;
    constructor(){
        this.db = new Database('./api/posts/products.sqlite')
    }

    createTable(){
        this.db.exec(`${createTablesProducts}`)
    }
} 

new CreateDb().createTable()
