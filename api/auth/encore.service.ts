import { Service } from "encore.dev/service";
import { middlewareAuth } from "./middleware/authSession";
import { middleware } from "encore.dev/api";

export default new Service('auth',{
    middlewares: [
        middleware({target:{tags:['/auth/update','/auth/dados','/auth/logout']}},middlewareAuth)
    ]
})