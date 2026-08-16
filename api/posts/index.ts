import { api } from "encore.dev/api";
import {  Gateway } from "encore.dev/api";
import {ParamsProductsSearch, ProductsResponse, PublishProductBody, ResponseGetMyproductsBuy, ResponseMyProducts, ResponseProductPerId } from "./interfacesPosts";
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
export const searchGetProducts =  api({method:"GET",path:"/post/products/:name",expose:true,},
    async({name}:{name:string}):Promise<ProductsResponse> => new PostsProducts().getSearchProducts(name)
)

export const getProductPerId = api({method:"GET",path:"/post/product/:id",expose:true},

    async({id}:{id:number}):Promise<ResponseProductPerId> => new PostsProducts().getProductsPerId(id)
)

export const postSellProducts = api({method:"POST",path:"/post/sell/product/:id",expose:true,auth:true},


    async({id}:{id:number}):Promise<PingResponse> => new PostsProducts().postTransationsProduct(id)
)

export const getAllMyProducts = api({method:"GET",path:"/products/my",expose:true,auth:true},

    async():Promise<ResponseMyProducts> => new PostsProducts().getAllMyProducts()
)
export const getAllMyProductsSell = api({method:"GET",path:"/products/my/sell",expose:true,auth:true},

    async():Promise<ResponseGetMyproductsBuy> => new PostsProducts().getAllMyProductsSell()
)

export const client = api.static({expose:true,path:'/postProducts',dir:"./assets"})

