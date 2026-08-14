import {  APIError, ErrCode, HttpStatus } from "encore.dev/api"
import { BodyCreateUser, BodyUpdateUser, PingParams, PingResponse } from "../utilsInterface"
import { QueryAuth } from "../query"
import { randomBytes } from "node:crypto"
import argon2 from 'argon2'
import { IncomingMessage, ServerResponse } from "node:http"
import { APICallMeta, currentRequest } from "encore.dev"
import { getAuthData } from "encore.dev/internal/codegen/auth"
import { SessionUser } from "../utils/interfaces"

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
        
        const insertAddress = this.insertAddress({cep:p.cep,cidade:p.cidade,estado:p.estado,numero:p.numero,rua:p.rua})
        
        if(!insertAddress.changes){
            
            throw new APIError(ErrCode.Internal,'Erro ao inserir endereço')
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
        
        console.log({insertSession})

        if(!insertSession.changes){
            throw new APIError(ErrCode.Internal,"Erro ao criar sessão")
        }
        res.setHeader("Set-Cookie",`__Secure-sid=${stringSession}; Path=/; Secure; HttpOnly; SameSite=Lax`)

     return res.end(JSON.stringify({message:"Usuário Logado"}))
    }
    updateUser = async(body:BodyUpdateUser):Promise<PingResponse> =>{
        
        const authData:SessionUser | null = getAuthData();

        if(!authData){
            throw new APIError(ErrCode.Unauthenticated,'Usuário não possui sessão')
        }


        const {name,email,password,cep,cidade,estado,numero,rua} =body
        
        if(!email || !password){
            throw new APIError(ErrCode.InvalidArgument,'Email ou senha estão vazil')
        }

       const hashPassword = await argon2.hash(password)

        const updateUser = this.updateUserData({name,email,password:hashPassword})

        if(!updateUser.changes){
            throw new APIError(ErrCode.Internal,'Erro ao atualizar usuário')
        }

        const updateAddress = this.updateAddress({cep,cidade,estado,numero,rua,user_id:authData.id})
    


        return {message:'Usuário atualizado',status:HttpStatus.Created}

    }
    getSession = async(req:IncomingMessage,res:ServerResponse):Promise<ServerResponse> =>{
        const callMeta = currentRequest()as APICallMeta

        
        const myData:{userData:string} = callMeta.middlewareData?.myMiddlewareData

        res.statusCode = 200;

        return res.end(JSON.stringify({username:myData.userData,session:true}))
    }
    getDados = async(req:IncomingMessage,res:ServerResponse):Promise<ServerResponse> =>{
        const callMeta = currentRequest()as APICallMeta

         const myData:{userData:{name:string;email:string}} = callMeta.middlewareData?.myMiddlewareData

         console.log({myData})

         const dados = this.selectAllDados({email:myData.userData.email})

        return res.end(JSON.stringify({message:'Meus dados',dados}))
    }
    deleteLogout = async(p:IncomingMessage,res:ServerResponse):Promise<ServerResponse | APIError> =>{

        const callMeta = currentRequest()as APICallMeta

        const myData:{userData:{name:string;email:string}} = callMeta.middlewareData?.myMiddlewareData

        const selectSession = this.selectSessionEmail({email:myData.userData.email})

        
        if(selectSession.revoked === 1){
            throw new APIError(ErrCode.PermissionDenied,'Nenhuma sessão ativa')
        }

        const revokedSession = this.revokedSession({email:myData.userData.email})

        if(!revokedSession.changes){
            throw new APIError(ErrCode.Internal,'Erro ao fazer logout')
        }

        res.setHeader('Cookie','');
        
        

        return res.end(JSON.stringify({message:"lOGOUT"}))
    }
} ;