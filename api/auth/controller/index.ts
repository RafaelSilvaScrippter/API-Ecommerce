import { APIError, ErrCode, HttpStatus } from "encore.dev/api"
import { BodyCreateUser, PingParams, PingResponse } from "../utilsInterface"
import { QueryAuth } from "../query"


export  class ApiAuth extends QueryAuth{
    postUser = async (p:PingParams & BodyCreateUser):Promise<PingResponse> =>{

        if(!p.name || !p.email || !p.password){
            throw new APIError(ErrCode.InvalidArgument,"Dados inválidos") 
        }
        
        const selectUserEmail = this.selectUser({email:p.email})
  
        if(!selectUserEmail){
            throw new APIError(ErrCode.AlreadyExists,'Email já está cadastrado')
        }
        
        const inserUser = this.insertUser({name:p.name,email:p.email,password:p.password})
        if(!inserUser.changes){
            throw new APIError(ErrCode.Internal,'Erro ao inserir usuário')
        }

        return {message:'Hello World',status:HttpStatus.OK}
    }
} ;