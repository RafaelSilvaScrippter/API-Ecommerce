import { APIError, ErrCode } from "encore.dev/api"
import { QueryAuth } from "../../auth/query"

const queryAuth = new QueryAuth()
export const  validateGetuser = async(cookie:string) =>{

        if(!cookie){
            throw APIError.unauthenticated('Usuário não autenticado')
        }
        const replaceCookie = cookie?.replace('__Secure-sid=','')
        
        if(replaceCookie){  
            const getUserPerSession = queryAuth.selectSession({sid_hash:replaceCookie})
           
            
            if(!getUserPerSession){
                throw new APIError(ErrCode.Unauthenticated,'Autenticação necessária')
            }
            
            return {email:getUserPerSession.email}
           
        }

        if(!replaceCookie){
            
            throw new APIError(ErrCode.Internal,'Ocorreu um erro no cookie')
        }

}