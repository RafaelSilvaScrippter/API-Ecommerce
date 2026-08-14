import Database from "better-sqlite3";
import { api } from "encore.dev/api";
import { TableAuth } from "./tablesAuth.js";
import { BodyCreateUser,PingParams, PingResponse } from "./utilsInterface.js";import { ApiAuth } from "./controller/index.js";


export const authCreate = api({method:'POST',path:"/auth/create"},
    
    async(p: PingParams & BodyCreateUser):Promise<PingResponse> => new ApiAuth().postUser(p)

)

export const authLogin = api.raw({method:'POST',path:"/auth/login",expose:true},
    
    async(req,res) =>  new ApiAuth().postLogin(req,res)

)
export const authUpdate = api.raw({method:'POST',path:"/auth/update",expose:true,tags:['/auth/update']},
    
    async(req,res) =>  new ApiAuth().updateUser(req,res)

)
export const authSession = api.raw({method:'GET',path:"/auth/session",expose:true},
    
    async(req,res) =>  new ApiAuth().getSession(req,res)

)
export const authAllDados = api.raw({method:'GET',path:"/auth/dados",expose:true,tags:['/auth/dados']},
    
    async(req,res) =>  new ApiAuth().getDados(req,res)

)
export const authLogout = api.raw({method:'DELETE',path:"/auth/logout",expose:true,tags:['/auth/logout']},
    async(req,res) =>   new ApiAuth().deleteLogout(req,res)
)

export const client = api.static({expose:true,path:'/!path',dir:"./assets"})

