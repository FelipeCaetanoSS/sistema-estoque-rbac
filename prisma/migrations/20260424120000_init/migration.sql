CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'USER');
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "categories" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
  "id" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "movements" (
  "id" TEXT NOT NULL,
  "type" "MovementType" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "productId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "movements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

ALTER TABLE "products"
  ADD CONSTRAINT "products_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "categories"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "movements"
  ADD CONSTRAINT "movements_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "products"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "movements"
  ADD CONSTRAINT "movements_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
