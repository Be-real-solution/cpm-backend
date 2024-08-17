-- CreateEnum
CREATE TYPE "AdminTypeEnum" AS ENUM ('admin', 'super');

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "type" "AdminTypeEnum" NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "full_name" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "address" VARCHAR NOT NULL,
    "manager" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "director" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "payment_day" INTEGER NOT NULL,
    "monthly_payment" INTEGER NOT NULL,
    "accountable" VARCHAR NOT NULL,
    "second_phone" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "shop_id" UUID NOT NULL,
    "sum" INTEGER NOT NULL,
    "monthly_payment" INTEGER NOT NULL,
    "for_month" DATE NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "title" VARCHAR NOT NULL,
    "subtitle" VARCHAR NOT NULL,
    "shop_id" UUID NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "passport" VARCHAR NOT NULL,
    "address" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "birthday" DATE NOT NULL,
    "second_address" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientToShop" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToShop_AB_unique" ON "_ClientToShop"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToShop_B_index" ON "_ClientToShop"("B");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ClientToShop" ADD CONSTRAINT "_ClientToShop_A_fkey" FOREIGN KEY ("A") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToShop" ADD CONSTRAINT "_ClientToShop_B_fkey" FOREIGN KEY ("B") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
