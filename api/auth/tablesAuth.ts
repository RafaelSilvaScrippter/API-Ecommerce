export const TableAuth = /*SQL */ `


    CREATE TABLE IF NOT EXISTS "users" (
        "id" INTEGER PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL COLLATE NOCASE UNIQUE,
        "password" TEXT NOT NULL,
        "cep" TEXT,
        "cidade" TEXT,
        "estado" TEXT,
        "numero" TEXT,
        "rua" TEXT
    ) STRICT;
`