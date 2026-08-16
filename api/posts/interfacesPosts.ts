import { Query } from "encore.dev/api";

export  interface PublishProductBody{
    name:string;
    price:string;
    description:string;
    vendor:string;
    src:string;
}

 interface ResponseAllProducts {
        name:string;
        slug:string;
        price:string;
        description:string;
        src:string;
    
}

export interface ProductsResponse {
    products:ResponseAllProducts[]
}

export interface ParamsProductsSearch{
    name:string;
}

interface ProductPerId{
    name:string;
    slug:string;
    price:string;
    description:string;
    src:string;
    sell:string;
}


export interface ResponseProductPerId{
    product:ProductPerId
}

export interface NotFound {
    message:string;
}

