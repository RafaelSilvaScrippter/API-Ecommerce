export const createTablesProducts = /*SQL */ `

    CREATE TABLE IF NOT EXISTS "products" (
        "product_id" INTEGER PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "price" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "src" TEXT NOT NULL
    )STRICT;
    CREATE TABLE IF NOT EXISTS "vendors" (
        "id" INTEGER PRIMARY KEY,
        "vendor_email" TEXT NOT NULL ,
        "product_vendor" INTEGER NOT NULL,
        "sell" TEXT NOT NULL DEFAULT "false" CHECK ("sell" IN ('false','true')),
        UNIQUE("vendor_email"),
        FOREIGN KEY ("product_vendor") REFERENCES "products"("product_id") ON DELETE CASCADE
    )STRICT;
    CREATE TABLE IF NOT EXISTS "products_buy" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "product_buy" INTEGER NOT NULL,
        "user_product_buy" TEXT NOT NULL,
        "user" TEXT NOT NULL,
        UNIQUE("user","product_buy"),
        FOREIGN KEY ("product_buy") REFERENCES "products"("product_id") ON DELETE CASCADE,
        FOREIGN KEY ("user_product_buy") REFERENCES "vendors"("vendor_email") ON DELETE CASCADE
    ) STRICT;

`