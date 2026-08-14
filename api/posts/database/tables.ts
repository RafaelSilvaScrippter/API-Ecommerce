export const createTablesProducts = /*SQL */ `

    CREATE TABLE IF NOT EXISTS "products" (
        "product_id" INTEGER PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" INTEGER NOT NULL UNIQUE,
        "price" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "src" TEXT NOT NULL
    )STRICT;

`