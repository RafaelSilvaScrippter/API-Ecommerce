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
            WHERE "name" LIKE ?
            
            
        `).all(name) as {name:string;slug:string;price:string;description:string;src:string}[];
    }
    selectProductId({id}:{id:number}){
        return this.db.prepare(/*SQl */ `
        
            SELECT "p".*,"v"."sell","v"."vendor_email" FROM "products" AS "p"
            INNER JOIN "vendors" AS "v" ON  "v"."id" = ${id}
            WHERE "p"."product_id" = ?
        `).get(id) as {product_id:string;name:string;slug:string;price:string;description:string;src:string;sell:string,vendor_email:string}
    }
    insertProductBuy({id,user_buy,user}:{id:number,user_buy:string,user:string}){
        return this.db.prepare(/*SQL */`
        
            INSERT OR IGNORE INTO "products_buy"
            ("product_buy","user_product_buy","user")
            VALUES
            (?,?,?)
            
        `).run(id,user_buy,user)
    }
    updateVendors({product_vendor}:{product_vendor:number}){
        return this.db.prepare(/*SQL */ `
        
            UPDATE "vendors" 
            SET "sell" = 'true'
            WHERE  "product_vendor" = ?
            
        `).run(product_vendor)
    }
}