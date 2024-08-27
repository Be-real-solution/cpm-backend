/*
  Warnings:

  - You are about to drop the column `read` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `shop_id` on the `notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_shop_id_fkey";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "read",
DROP COLUMN "shop_id";

-- CreateTable
CREATE TABLE "shop_notification" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "read" BOOLEAN NOT NULL DEFAULT false,
    "shop_id" UUID NOT NULL,
    "notification_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "shop_notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shop_notification" ADD CONSTRAINT "shop_notification_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shop_notification" ADD CONSTRAINT "shop_notification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
