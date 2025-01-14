/*
  Warnings:

  - You are about to drop the column `external_transaction` on the `tuition_histories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tuition_histories" DROP COLUMN "external_transaction";

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "transaction" JSONB,
    "tuition_history_id" INTEGER,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tuition_history_id_fkey" FOREIGN KEY ("tuition_history_id") REFERENCES "tuition_histories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
