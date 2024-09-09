/*
  Warnings:

  - You are about to drop the column `paymentType` on the `contract` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodEnum" AS ENUM ('sum', 'percent');

-- AlterTable
ALTER TABLE "contract" DROP COLUMN "paymentType",
ADD COLUMN     "paymentMethod" "PaymentMethodEnum" NOT NULL DEFAULT 'percent';

-- DropEnum
DROP TYPE "PaymentTypeEnum";
