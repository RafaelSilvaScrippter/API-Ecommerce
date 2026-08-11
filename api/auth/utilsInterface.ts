import { Cookie, Header, HttpStatus, Query } from "encore.dev/api";
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
