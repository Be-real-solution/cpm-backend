/*
  Warnings:

  - You are about to drop the `_ClientToShop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClientToShop" DROP CONSTRAINT "_ClientToShop_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToShop" DROP CONSTRAINT "_ClientToShop_B_fkey";

-- DropTable
DROP TABLE "_ClientToShop";

-- CreateTable
CREATE TABLE "shop_client" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "shop_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "shop_client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shop_client" ADD CONSTRAINT "shop_client_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shop_client" ADD CONSTRAINT "shop_client_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
