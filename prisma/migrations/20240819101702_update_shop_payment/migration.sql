/*
  Warnings:

  - Added the required column `for_year` to the `shop_payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `for_month` on the `shop_payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "shop_payment" ADD COLUMN     "for_year" INTEGER NOT NULL,
DROP COLUMN "for_month",
ADD COLUMN     "for_month" INTEGER NOT NULL;
