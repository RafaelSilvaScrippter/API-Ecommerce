
import { PublishProductBody } from "../interfacesPosts";
import { PingResponse } from "../../auth/utilsInterface";
import {APIError, Cookie, ErrCode, HttpStatus } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

import { getAuthData } from "encore.dev/internal/codegen/auth";
import { QueryProducts } from "../database/query";
import { validateGetuser } from "../../middlewares/auth";
import { SessionUser } from "../../utils/interfaces";

interface AuthParams {
  sessionId: Cookie<"__Secure-sid">;
}

type User = {
    userID:string;
}

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
        const user = getAuthData()
        
        const slug = p.name + Math.random().toFixed(10).toString();

        const insertProcucts = this.insertProducts({name:p.name,slug:slug,price:p.price,description:p.description,src:p.src})

        if(!insertProcucts.changes){
            throw new APIError(ErrCode.Internal,'Erro ao inserir produtos')
        }
        


        return {message:"Produto adicionado com sucesso",status:HttpStatus.OK}
    }
}