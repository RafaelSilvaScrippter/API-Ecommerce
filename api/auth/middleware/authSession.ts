import { APIError, ErrCode, HandlerResponse,middleware, MiddlewareRequest, Next } from "encore.dev/api";
import { QueryAuth } from "../query";


const queryAuth = new QueryAuth()

export  const middlewareAuth = middleware({target:{tags:['/post/publish','/post/product']}}, async(req,next) => { 

    const cookie = req.rawRequest?.headers['cookie']
    if(!cookie?.includes('__Secure-sid=')){
        throw new APIError(ErrCode.Unauthenticated,'Autenticação necessária')
    }
    const replaceCookie = cookie?.replace('__Secure-sid=','')
    
    if(replaceCookie){  
        const getUserPerSession = queryAuth.selectSession({sid_hash:replaceCookie})
       
        
        if(!getUserPerSession){
            throw new APIError(ErrCode.Unauthenticated,'Autenticação necessária')
        }
        
        const sessionIsRevoked = queryAuth.selectSessionEmail({email:getUserPerSession.email})

         req.data.myMiddlewareData = { userData: {name:getUserPerSession.name,email:getUserPerSession.email,id:getUserPerSession.id} };
    }
    
    return await next(req);
})
