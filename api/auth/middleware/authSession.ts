import { Cookie, HandlerResponse, Header, MiddlewareRequest, Next } from "encore.dev/api";
import { IncomingMessage } from "http";
import { QueryAuth } from "../query";

const queryAuth = new QueryAuth()

export async function middlewareAuth(req:MiddlewareRequest,next:Next):Promise<HandlerResponse> {

    const cookie = req.rawRequest?.headers['cookie']

    if(!cookie?.includes('__Secure-sid=')){
        req.rawResponse?.end(JSON.stringify({message:"Cookie inválido"}))
        if(req.rawResponse){
            req.rawResponse.statusCode = 409;
        }

    }
     const replaceCookie = cookie?.replace('__Secure-sid=','')

    if((replaceCookie === undefined)){
         req.rawResponse?.end(JSON.stringify({message:"Token inválido"}))
    }

    if(replaceCookie){  
        const getUserPerSession = queryAuth.selectSession({sid_hash:replaceCookie})
        req.data.myMiddlewareData = { userData: getUserPerSession.name };

        if(!getUserPerSession){
            req.rawResponse?.end(JSON.stringify({message:"Nenhuma sessão ativa"}))
        }
    }
    
    return await next(req);

}