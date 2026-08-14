import { CreateDb } from "./create";

interface InsertProducts{
    name:string;
    slug:string;
    price:string;
    description:string;
    src:string;
}

export class QueryProducts extends CreateDb{
    

    insertProducts({name,slug,price,description,src}:InsertProducts){

        return this.db.prepare(/*SQL */ `
        
            INSERT OR IGNORE INTO "products" (
                "name","slug","price",
                "description","src"
            )
            
            VALUES (?,?,?,?,?)
            
        `).run(name,slug,price,description,src)

    }
}