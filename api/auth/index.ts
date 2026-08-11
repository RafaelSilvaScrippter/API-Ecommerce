import Database from "better-sqlite3";
import { api, APIError, Cookie, ErrCode, Header, HttpStatus, Query } from "encore.dev/api";
import { TableAuth } from "./tablesAuth.js";
import { BodyCreateUser, PingParams, PingResponse } from "./utilsInterface.js";
import { QueryAuth } from "./query.js";


export class CreateDatabase{
    db:Database.Database;
    constructor(){
        this.db = new Database('./api/auth/db.sqlite')
    }


    create(){
        this.db.exec(TableAuth)
    }
}

export  class ApiAuth extends QueryAuth{
    postUser = async (p:PingParams & BodyCreateUser):Promise<PingResponse> =>{

        if(!p.name || !p.email || !p.password){
            throw new APIError(ErrCode.InvalidArgument,"Dados inválidos") 
        }

        const inserUser = this.insertUser({name:p.name,email:p.email,password:p.password})

        return {message:'Hello World',status:HttpStatus.OK}
    }
} ;


export const auth = api({method:'POST',path:"/auth/create"},
    
    async(p: PingParams & BodyCreateUser):Promise<PingResponse> => {
        const {message,status} = await new  ApiAuth().postUser(p)
      return  {
        message,
        status
      }
    }

)


const QueryDatabase = new QueryAuth()
