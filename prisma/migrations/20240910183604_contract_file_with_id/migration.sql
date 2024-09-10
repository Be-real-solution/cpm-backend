-- AlterTable
ALTER TABLE "contract" ADD COLUMN     "ID" SERIAL NOT NULL,
ADD COLUMN     "starter_file" VARCHAR DEFAULT '';
