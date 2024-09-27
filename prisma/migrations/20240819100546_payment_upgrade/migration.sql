/*
  Warnings:

  - You are about to drop the column `for_month` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `monthly_payment` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `shop_id` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_shop_id_fkey";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "for_month",
DROP COLUMN "monthly_payment",
DROP COLUMN "shop_id";

-- CreateTable
CREATE TABLE "shop_payment" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "shop_id" UUID NOT NULL,
    "for_month" DATE NOT NULL,
    "monthly_payment" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "shop_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_part" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sum" INTEGER NOT NULL,
    "payment_id" UUID NOT NULL,
    "shop_payment_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "payment_part_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shop_payment" ADD CONSTRAINT "shop_payment_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_part" ADD CONSTRAINT "payment_part_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_part" ADD CONSTRAINT "payment_part_shop_payment_id_fkey" FOREIGN KEY ("shop_payment_id") REFERENCES "shop_payment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
