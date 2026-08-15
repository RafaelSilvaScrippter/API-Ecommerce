
import { ParamsProductsSearch, ProductsResponse, PublishProductBody } from "../interfacesPosts";
import { PingResponse } from "../../auth/utilsInterface";
import {APIError, Cookie, ErrCode, HttpStatus } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

import { getAuthData } from "encore.dev/internal/codegen/auth";
import { QueryProducts } from "../database/query";
import { validateGetuser } from "../../middlewares/auth";
import { CreateDb } from "../database/create";

interface AuthParams {
  sessionId: Cookie<"__Secure-sid">;
}

type User = {
    userID:string;
}


const createDb = new CreateDb().createTable()

// Auth handler that uses cookies
export const authUser = authHandler<AuthParams, User>(async ({ sessionId }) => {

    const validUser = await validateGetuser(sessionId.value) 

    if(!validUser){
        throw new APIError(ErrCode.Internal,'Erro ao pegar usuário')
    }



    return {userID:validUser.userID.email}
});

export class PostsProducts extends QueryProducts {

    publishProduct = async(p:PublishProductBody):Promise<PingResponse> =>{
        const {userID}:any = getAuthData()
        
        const slug = p.name + Math.random().toFixed(10).toString();

        const insertProcucts = this.insertProducts({name:p.name,slug:slug,price:p.price,description:p.description,src:p.src})

        if(!insertProcucts.changes || !insertProcucts.lastInsertRowid){
            throw new APIError(ErrCode.Internal,'Erro ao inserir produtos')
        }

        

        const insertVendor = this.insertVendors({vendor_email:userID,product_vendor:insertProcucts.lastInsertRowid})
      


        return {message:"Produto adicionado com sucesso",status:HttpStatus.OK}
    }
    getAllProducts = async():Promise<ProductsResponse> =>{

    
        const products = this.selectAllProducts()
            
        console.log(products)
            
        return {products}
        
    }
    getSearchProducts = async(name:string):Promise<ProductsResponse> =>{

        if(!name){
            throw new APIError(ErrCode.InvalidArgument,'Nenhum parâmetro')
        }

        const products = this.selectSearchProducts({name})
        try{
            const products = this.selectSearchProducts({name})
            return {products}
            
        }catch(err){
            
            console.log(err)
        }
        return {products}

    }
}