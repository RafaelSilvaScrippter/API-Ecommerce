import Database from "better-sqlite3";
import { api, APIError, Cookie, ErrCode, Header, HttpStatus, Query } from "encore.dev/api";
import { TableAuth } from "./tablesAuth.js";
import { BodyCreateUser, BodyLoginUser, LoginResponse, PingParams, PingResponse } from "./utilsInterface.js";
import { QueryAuth } from "./query.js";
import { ApiAuth } from "./controller/index.js";


export class CreateDatabase{
    db:Database.Database;
    constructor(){
        this.db = new Database('./api/auth/db.sqlite')
    }


    create(){
        this.db.exec(TableAuth)
    }
}




export const authCreate = api({method:'POST',path:"/auth/create"},
    
    async(p: PingParams & BodyCreateUser):Promise<PingResponse> => new ApiAuth().postUser(p)

)

export const authLogin = api.raw({method:'POST',path:"/auth/login",expose:true},
    
    async(req,res) =>  new ApiAuth().postLogin(req,res)

)


const QueryDatabase = new QueryAuth()
