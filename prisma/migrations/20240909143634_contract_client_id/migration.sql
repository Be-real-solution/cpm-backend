-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
