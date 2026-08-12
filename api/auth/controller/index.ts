import { api, APIError, ErrCode, HttpStatus } from "encore.dev/api"
import { BodyCreateUser, BodyLoginUser, LoginResponse, PingParams, PingResponse } from "../utilsInterface"
import { QueryAuth } from "../query"
import { randomBytes } from "node:crypto"


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

        return {message:'Usuário criado',status:HttpStatus.Created}
    }
    postLogin = async (p:PingParams & BodyLoginUser):Promise<PingResponse & LoginResponse> =>{

        if(!p.email || p.password){
            throw new APIError(ErrCode.InvalidArgument,'Dados incorretos')
        }

        const selectUserEmail = this.selectUser({email:p.email});

        if(!selectUserEmail.email){
            throw new APIError(ErrCode.InvalidArgument,'Dados incorretos')
        }

        const stringSession =  randomBytes(32).toString('hex')
        
        const insertSession = this.insertSession({session_hash:stringSession,user_id:selectUserEmail.id})

        if(!insertSession){
            throw new APIError(ErrCode.Internal,"Erro ao criar sessão")
        }

        return {message:'Login feito',sessionId:{
            value:stringSession,
            path:'/',
            sameSite:"Lax",
            secure:true,
            httpOnly:true
        },status:HttpStatus.OK}
    }
} ;