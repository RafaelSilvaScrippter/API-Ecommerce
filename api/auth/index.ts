import { api, Cookie, Header, HttpStatus, Query } from "encore.dev/api";

interface PingParams {
    language:Header<'Content-Type'>;
    name:Query<string>;
    id:number;
    settings?: Cookie<'__Secure_sid'>
} 

interface PingResponse {
    message:string;
    status:HttpStatus;
}

export  class ApiAuth{
    getLogin = async (p:PingParams):Promise<PingResponse> =>{

        console.log({p})
        return {message:'Hello Worldl',status:HttpStatus.OK}
    }
}


export const auth = api({method:'GET',path:"/auth/login/:id"},
    
    async(p: PingParams):Promise<PingResponse> => {
        const {message,status} = await new  ApiAuth().getLogin(p)
      return  {
        message,
        status
      }
    }

)