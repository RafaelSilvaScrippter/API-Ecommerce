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