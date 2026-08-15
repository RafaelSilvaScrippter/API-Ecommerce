import {test,expect, describe} from 'vitest';
import { PublishProductBody } from '../interfacesPosts';


    
   
    describe("Tests posts products",() => {
    
        async function testePuublishProduct():Promise<unknown>{

            const response = await fetch('http://127.0.0.1:4000/post/product/notebook',{
                method:"GET"
            })
            const dados = await response.json()
            console.log(dados)

            return dados

        }
        
        test('Return data array products get peer name',async () =>{
            expect(await testePuublishProduct()).toEqual(expect.objectContaining({products:expect.arrayContaining([
                expect.objectContaining({
                    description: 'Um notebook',
                    name: 'Notebook',
                    price: '2000',
                    product_id: 2,
                    slug: 'Notebook0.3632290118',
                    src: './files/notebook.jpg'
                })
            ])}))
        })
    })
