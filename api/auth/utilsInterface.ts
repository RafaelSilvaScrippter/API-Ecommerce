import { Cookie, CookieWithOptions, Header, HttpStatus } from "encore.dev/api";
import { IsEmail } from "encore.dev/validate";

export interface PingParams {
    language:Header<'Content-Type'>;
} 

export interface PingResponse {
    message:string;
    status:HttpStatus;
}

export interface BodyCreateUser{
    name?:string;
    email?:string & IsEmail;
    password?:string;
    cep?:string;
    cidade?:string;
    estado?:string;
    numero?:string;
    rua?:string
}
export interface BodyUpdateUser{
    name?:string;
    email?:string & IsEmail;
    password?:string;
    cep?:string;
    cidade?:string;
    estado?:string;
    numero?:string;
    rua?:string
}

export interface BodyLoginUser {
    email?:string;
    password?:string;
}

export interface LoginResponse{
    sessionId:CookieWithOptions<string>
} 


interface GetAllDados {
    name:string;
    email:string;
    cep:string;
    cidade:string;
    estado:string;
    numero:string;
    rua:string;
}

export interface ResponseGetAllDados {
    message:string;
    dados:GetAllDados
}