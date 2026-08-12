import { APIError, Cookie, ErrCode, HandlerResponse, Header, middleware, MiddlewareRequest, Next } from "encore.dev/api";
import { IncomingMessage } from "http";
import { QueryAuth } from "../query";
import { auth } from "~encore/clients";

const queryAuth = new QueryAuth()

export  const middlewareAuth = middleware({target:{auth:true}},async(req:MiddlewareRequest,next:Next):Promise<HandlerResponse> => {

    const cookie = req.rawRequest?.headers['cookie']

    if(!cookie?.includes('__Secure-sid=')){
        if(req.rawResponse){
            req.rawResponse?.end(JSON.stringify({message:"Cookie inválido"}))
            req.rawResponse.statusCode = 409;
        }

    }
     const replaceCookie = cookie?.replace('__Secure-sid=','')

    if(replaceCookie){  
        const getUserPerSession = queryAuth.selectSession({sid_hash:replaceCookie})
        req.data.myMiddlewareData = { userData: {name:getUserPerSession.name,email:getUserPerSession.email,id:getUserPerSession.id} };

        if(!getUserPerSession){
            req.rawResponse?.end(JSON.stringify({message:"Nenhuma sessão ativa"}))
        }
    }
    
    return await next(req);
})
