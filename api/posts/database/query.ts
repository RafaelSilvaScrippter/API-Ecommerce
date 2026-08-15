import { CreateDb } from "./create";

interface InsertProducts{
    name:string;
    slug:string;
    price:string;
    description:string;
    src:string;
}

interface InsertVendorProduct{
    vendor_email:string;
    product_vendor:BigInt | number;
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
    insertVendors({vendor_email,product_vendor}:InsertVendorProduct){
        return this.db.prepare(/*SQL */ `
                
            INSERT OR IGNORE INTO "vendors" 
                ("vendor_email","product_vendor")
                VALUES 
            (?,?)   
        `).run(vendor_email,product_vendor)
      
    }
    selectAllProducts(){
        return this.db.prepare(/*SQL */ `
        
            SELECT * FROM "products"
            
        `).all() as {name:string;slug:string;price:string;description:string;src:string}[];
    }
    selectSearchProducts({name}:{name:string}){
        return this.db.prepare(/*SQL */`
        
            SELECT * FROM "products" 
            WHERE "name" LIKE ?%
            
            
        `).all(name) as {name:string;slug:string;price:string;description:string;src:string}[];
    }
}