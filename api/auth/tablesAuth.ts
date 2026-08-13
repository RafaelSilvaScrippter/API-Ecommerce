export const TableAuth = /*SQL */ `


    CREATE TABLE IF NOT EXISTS "data_user" (
        "id" INTEGER PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL COLLATE NOCASE UNIQUE,
        "password" TEXT NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS "address_user" (
        "id" INTEGER PRIMARY KEY,
        "cep" TEXT,
        "cidade" TEXT,
        "estado" TEXT,
        "numero" TEXT,
        "rua" TEXT,
        FOREIGN KEY ("id") REFERENCES "data_user" ("id")
    )STRICT;
    CREATE TABLE IF NOT EXISTS "sessions" (
        "id" INTEGER PRIMARY KEY,
        "session_hash" TEXT NOT NULL UNIQUE,
        "user_id" INTEGER NOT NULL,
        "revoked" INTEGER NOT NULL check("revoked" IN (1,0)),
        FOREIGN KEY ("user_id") REFERENCES "data_user" ("id")
    ) STRICT;
`