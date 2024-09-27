-- CreateEnum
CREATE TYPE "UnitTypeEnum" AS ENUM ('kg', 'pc');

-- CreateEnum
CREATE TYPE "PaymentTypeEnum" AS ENUM ('sum', 'percent');

-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "type" SET DEFAULT 'admin';

-- AlterTable
ALTER TABLE "client" ALTER COLUMN "address" SET DEFAULT '',
ALTER COLUMN "is_active" SET DEFAULT true,
ALTER COLUMN "second_address" SET DEFAULT '';

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "subtitle" SET DEFAULT '';

-- AlterTable
ALTER TABLE "shop" ALTER COLUMN "payment_day" SET DEFAULT 5,
ALTER COLUMN "second_phone" SET DEFAULT '';

-- CreateTable
CREATE TABLE "contract" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "client_id" UUID NOT NULL,
    "month_count" INTEGER NOT NULL,
    "paymentType" "PaymentTypeEnum" NOT NULL DEFAULT 'percent',
    "payment_value" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_product" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 1,
    "unitType" "UnitTypeEnum" NOT NULL DEFAULT 'pc',
    "contract_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "contract_product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contract_product" ADD CONSTRAINT "contract_product_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
