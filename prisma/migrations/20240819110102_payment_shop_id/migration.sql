/*
  Warnings:

  - Added the required column `shop_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "shop_id" UUID NOT NULL;
