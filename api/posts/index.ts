import { api } from "encore.dev/api";
import {  Gateway } from "encore.dev/api";
import { ProductsResponse, PublishProductBody } from "./interfacesPosts";
import { authUser, PostsProducts } from "./controller";
import { PingResponse } from "../auth/utilsInterface";



export const gateway = new Gateway({
  authHandler: authUser,
});

export const postProduct =  api({method:"POST",path:"/post/publish",expose:true,auth:true},
    async(body:PublishProductBody):Promise<PingResponse> => new PostsProducts().publishProduct(body)
)
export const getProductsAll =  api({method:"GET",path:"/post/publish",expose:true,},
    async():Promise<ProductsResponse> => new PostsProducts().getAllProducts()
)

export const client = api.static({expose:true,path:'/postProducts',dir:"./assets"})

