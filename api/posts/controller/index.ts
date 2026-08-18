import {
  ProductsResponse,
  PublishProductBody,
  ResponseGetMyproductsBuy,
  ResponseMyProducts,
  ResponseMyProductsSell,
  ResponseProductPerId,
} from "../interfacesPosts";
import { PingResponse } from "../../auth/utilsInterface";
import { APIError, Cookie, ErrCode, HttpStatus } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

import { getAuthData } from "encore.dev/internal/codegen/auth";
import { QueryProducts } from "../database/query";
import { validateGetuser } from "../../middlewares/auth";
import { CreateDb } from "../database/create";
import { QueryAuth } from "../../auth/query";
import { IncomingMessage, ServerResponse } from "node:http";
import busboy from "busboy";
import log from "encore.dev/log";

import fs from "node:fs";
import path from "node:path";
import { readFile } from "node:fs/promises";

const uploadDir = path.join(process.cwd(), "uploads");

fs.mkdirSync(uploadDir, { recursive: true });

interface AuthParams {
  sessionId: Cookie<"__Secure-sid">;
}

type User = {
  userID: string;
};

const createDb = new CreateDb().createTable();

// Auth handler that uses cookies
export const authUser = authHandler<AuthParams, User>(async ({ sessionId }) => {
  const validUser = await validateGetuser(sessionId.value);

  if (!validUser) {
    throw new APIError(ErrCode.Internal, "Erro ao pegar usuário");
  }

  return { userID: validUser.userID.email };
});

type FileEntry = { data: any[]; filename: string };

const queryAuth = new QueryAuth();

export class PostsProducts extends QueryProducts {
  publishProduct = async (p: PublishProductBody): Promise<PingResponse> => {
    const { userID }: any = getAuthData();

    const slug = p.name + Math.random().toFixed(10).toString();

    const insertProcucts = this.insertProducts({
      name: p.name,
      slug: slug,
      price: p.price,
      description: p.description,
      src: "null",
    });

    if (!insertProcucts.changes || !insertProcucts.lastInsertRowid) {
      throw new APIError(ErrCode.Internal, "Erro ao inserir produtos");
    }

    const insertVendor = this.insertVendors({
      vendor_email: userID,
      product_vendor: insertProcucts.lastInsertRowid,
    });

    return {
      message: "Produto adicionado com sucesso",
      status: HttpStatus.Accepted,
    };
  };
  getAllProducts = async (): Promise<ProductsResponse> => {
    const products = this.selectAllProducts();

    if (!products) {
      throw new APIError(ErrCode.NotFound, "Nenhum produto encontrado");
    }

    console.log(products);

    return { products, status: HttpStatus.Accepted };
  };
  getSearchProducts = async (name: string): Promise<ProductsResponse> => {
    if (!name) {
      throw new APIError(ErrCode.InvalidArgument, "Nenhum parâmetro");
    }

    const products = this.selectSearchProducts({ name });

    return { products, status: HttpStatus.Accepted };
  };
  getProductsPerId = async (id: number): Promise<ResponseProductPerId> => {
    const product = this.selectProductId({ id });

    if (!product) {
      throw new APIError(ErrCode.NotFound, "Nenhum produto encontrado");
    }

    return { product, status: HttpStatus.Accepted };
  };
  postTransationsProduct = async (id: number): Promise<PingResponse> => {
    const { userID }: any = getAuthData();

    if (!userID) {
      throw new APIError(ErrCode.Unauthenticated, "Usuário não está logado");
    }

    if (!id) {
      throw new APIError(ErrCode.InvalidArgument, "nenhum produto encontrado");
    }

    const selectProduct = this.selectProductId({ id });

    if (!selectProduct) {
      throw new APIError(ErrCode.NotFound, "Nenhum produto encontrado");
    }

    if (selectProduct.sell === "true") {
      throw new APIError(ErrCode.Unavailable, "Produto já foi comprado");
    }

    if (userID === selectProduct.vendor_email) {
      throw new APIError(
        ErrCode.Internal,
        "Você não pode comprar o seu proprio produto",
      );
    }

    const insertProductBuy = this.insertProductBuy({
      id,
      user_buy: selectProduct.vendor_email,
      user: userID,
    });

    if (!insertProductBuy.changes) {
      throw new APIError(ErrCode.Internal, "Erro ao comprar produto");
    }

    const updateForTrueSellVendor = this.updateVendors({ product_vendor: id });

    if (!updateForTrueSellVendor) {
      throw new APIError(ErrCode.Internal, "Erro ao comprar produto");
    }

    return { message: "Transação feita", status: HttpStatus.Accepted };
  };
  getAllMyProducts = async (): Promise<ResponseMyProducts> => {
    const { userID }: any = getAuthData();

    if (!userID) {
      throw new APIError(ErrCode.Unauthenticated, "Usuário não está logado");
    }

    const myProductsPublish = this.getAllMyProduct({ email: userID });

    if (!myProductsPublish) {
      throw new APIError(ErrCode.Internal, "Erro ao pegar seus produtos");
    }

    return { products: myProductsPublish, status: HttpStatus.Created };
  };
  getAllMyProductsBuy = async (): Promise<ResponseGetMyproductsBuy> => {
    const { userID }: any = getAuthData();

    if (!userID) {
      throw new APIError(
        ErrCode.Unauthenticated,
        "Usuário não está autenticado",
      );
    }

    const selectAllProductsMy = this.selectAllMyProductsBuy({ email: userID });

    if (!selectAllProductsMy) {
      throw new APIError(ErrCode.Internal, "Erro ap pegar meus produtos");
    }

    const dados = selectAllProductsMy.map((user) => {
      return queryAuth.selectAllDados({ email: user.user });
    });

    return { products: selectAllProductsMy, address: dados };
  };
  getAllMyProdcutsSell = async (): Promise<ResponseMyProductsSell> => {
    const { userID }: any = getAuthData();

    if (!userID) {
      throw new APIError(ErrCode.Unauthenticated, "Usuário não está logado");
    }

    const selectAllProductsMy = this.selectAllMyProductsSell({ email: userID });

    if (!selectAllProductsMy) {
      throw new APIError(ErrCode.Internal, "Erro ap pegar meus produtos");
    }

    return { products: selectAllProductsMy };
  };
  deleteMyProcustPublish = async ({
    id,
  }: {
    id: number;
  }): Promise<PingResponse> => {
    const { userID }: any = getAuthData();

    if (!userID) {
      throw new APIError(
        ErrCode.Unauthenticated,
        "Uusário não está autenticado",
      );
    }

    if (!id) {
      throw new APIError(ErrCode.Internal, "Nenhum parametro passado");
    }

    const selectProduct = this.selectVendorProductIsSell({
      email: userID,
      product_vendor: id,
    });
    console.log(selectProduct);

    if (!selectProduct) {
      throw new APIError(ErrCode.Internal, "Erro ao excluir produto");
    }

    if (selectProduct.sell === "true") {
      throw new APIError(ErrCode.Unavailable, "Produto já foi vendido");
    }

    const deeleteMyProduct = this.deleteMyProductPosted({
      email: userID,
      id: id,
    });

    if (!deeleteMyProduct.changes) {
      throw new APIError(ErrCode.Internal, "Erro ao excluir produto");
    }

    return { message: "Deletando produtos", status: HttpStatus.Created };
  };
  uploadFile = async (
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<ServerResponse> => {
    const entry: FileEntry = { filename: "", data: [] };

    const bb = busboy({
      headers: req.headers,
      limits: { files: 1 },
    });

    bb.on("file", (_, file, info) => {
      const filename = `${Date.now()}-${info.filename}`;
      const filepath = path.join(uploadDir, filename);

      const writeStream = fs.createWriteStream(filepath);

      file.pipe(writeStream);

      writeStream.on("finish", () => {
        log.info(`File ${filename} uploaded`);
        this.insertUpdatePathImage({ path: filename });
      });

      writeStream.on("error", (err) => {
        log.error(err);
      });
    });

    req.pipe(bb);

    return res.end(JSON.stringify({ dados: "Arquivo postado" }));
  };
  readFileUpload = async (
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<ServerResponse> => {
    console.log(req);
    const url = new URL(
      req.url ?? "",
      "http://127.0.0.1:4000",
    ).pathname.replace("/read/image/product", "");

    const filepath = path.join(process.cwd(), "uploads", url);

    if (!fs.existsSync(filepath)) {
      res.statusCode = 404;
      res.end("Imagem não encontrada");
    }

    const image = fs.readFileSync(filepath);

    res.setHeader("Content-Type", "image/jpeg");
    return res.end(image);
  };
}
