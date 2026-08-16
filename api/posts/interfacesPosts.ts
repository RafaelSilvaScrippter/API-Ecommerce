import { HttpStatus, Query } from "encore.dev/api";

export  interface PublishProductBody{
    name:string;
    price:string;
    description:string;
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
    products:ResponseAllProducts[],
    status:HttpStatus
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
    vendor_email:string;
}


export interface ResponseProductPerId{
    product:ProductPerId;
    status:HttpStatus
}


interface MyProducts{
    name:string;
    price:string;
    src:string;
    sell:string;
}

export interface ResponseMyProducts{
    products:MyProducts[];
    status:HttpStatus;
}

