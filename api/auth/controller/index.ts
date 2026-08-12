import { api, APIError, ErrCode, HttpStatus } from "encore.dev/api"
import { BodyCreateUser, BodyLoginUser, LoginResponse, PingParams, PingResponse } from "../utilsInterface"
import { QueryAuth } from "../query"
import { randomBytes } from "node:crypto"
import { argon2d } from "argon2"
import argon2 from 'argon2'
import { IncomingMessage, ServerResponse } from "node:http"
import { APICallMeta, currentRequest } from "encore.dev"


export  class ApiAuth extends QueryAuth{
    postUser = async (p:PingParams & BodyCreateUser):Promise<PingResponse> =>{

        if(!p.name || !p.email || !p.password){
            throw new APIError(ErrCode.InvalidArgument,"Dados inválidos") 
        }
        
        const selectUserEmail = this.selectUser({email:p.email})
  
        if(selectUserEmail){
            throw new APIError(ErrCode.AlreadyExists,'Email já está cadastrado')
        }
        
        const password_hash = await argon2.hash(p.password)

        const inserUser = this.insertUser({name:p.name,email:p.email,password:password_hash})
        if(!inserUser.changes){
            throw new APIError(ErrCode.Internal,'Erro ao inserir usuário')
        }

        return {message:'Usuário criado',status:HttpStatus.Created}
    }
    postLogin = async (req:IncomingMessage,res:ServerResponse):Promise<ServerResponse> =>{

        let data = ''

        for await (const chunk of req){
            data += chunk.toString();
        }

        const p = JSON.parse(data);

        if(!p.email || !p.password){
            throw new APIError(ErrCode.InvalidArgument,'Dados incorretos')
        }

        const selectUserEmail = this.selectUser({email:p.email});

        if(!selectUserEmail){
            throw new APIError(ErrCode.InvalidArgument,'Dados incorretos')
        }


        if(!selectUserEmail.email){
            throw new APIError(ErrCode.InvalidArgument,'Dados incorretos')
        }

        if(!selectUserEmail.password){
            throw new APIError(ErrCode.InvalidArgument,'Dados incorretos')
        }

        const isValidPassword = await argon2.verify(selectUserEmail.password,p.password)

        if(!isValidPassword){
            throw new APIError(ErrCode.InvalidArgument,'Dados inválidos')
        }

        const stringSession =  randomBytes(32).toString('hex')
        
        const insertSession = this.insertSession({session_hash:stringSession,user_id:selectUserEmail.id})
        console.log(insertSession)
        
        if(!insertSession.changes){
            throw new APIError(ErrCode.Internal,"Erro ao criar sessão")
        }
        res.setHeader("Set-Cookie",`__Secure-sid=${stringSession}; Path=/; Secure; HttpOnly; SameSite=Lax`)

     return res.end(JSON.stringify({message:"Usuário Logado"}))
    }
    updateUser = async(req:IncomingMessage,res:ServerResponse):Promise<ServerResponse> =>{

        const callMeta = currentRequest()as APICallMeta

        let data = ''
        for await (const chunk of req){
            data += chunk.toString();
        }

        const {name,email,password,cep,cidade,estado,numero,rua} = JSON.parse(data);
        
        if(!email || !password){
            throw new APIError(ErrCode.InvalidArgument,'Email ou senha estão vazil')
        }

       const hashPassword = await argon2.hash(password)

        const updateUser = this.updateUserData({name,email,password:hashPassword,cep,cidade,estado,numero,rua})

        if(!updateUser.changes){
            throw new APIError(ErrCode.Internal,'Erro ao atualizar usuário')
        }

        return res.end(JSON.stringify({message:"Usuário atualizado"}))

    }
    getSession = async(req:IncomingMessage,res:ServerResponse):Promise<ServerResponse> =>{
        const callMeta = currentRequest()as APICallMeta

        
        const myData:{userData:string} = callMeta.middlewareData?.myMiddlewareData

        res.statusCode = 200;

        return res.end(JSON.stringify({username:myData.userData,session:true}))
    }
} ;