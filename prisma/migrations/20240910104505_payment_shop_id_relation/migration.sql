-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
