/*
  Warnings:

  - Added the required column `name` to the `contract` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractStatusEnum" AS ENUM ('active', 'cancelled', 'closed');

-- AlterTable
ALTER TABLE "client" ADD COLUMN     "fathers_name" VARCHAR NOT NULL DEFAULT '',
ADD COLUMN     "jshshir" VARCHAR NOT NULL DEFAULT '',
ADD COLUMN     "passportAddress" VARCHAR NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "contract" ADD COLUMN     "name" VARCHAR NOT NULL,
ADD COLUMN     "status" "ContractStatusEnum" NOT NULL DEFAULT 'active';
