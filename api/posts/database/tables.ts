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
        "vendor_email" TEXT NOT NULL,
        "product_vendor" INTEGER NOT NULL,
        "sell" TEXT NOT NULL DEFAULT 'false' CHECK ("sell" IN ('false','true')),
        UNIQUE ("product_vendor","vendor_email"),
        FOREIGN KEY ("product_vendor") REFERENCES "products"("product_id") ON DELETE CASCADE
    )STRICT;

`