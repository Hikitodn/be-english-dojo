/*
  Warnings:

  - Made the column `tuition_history_id` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_tuition_history_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "tuition_history_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tuition_history_id_fkey" FOREIGN KEY ("tuition_history_id") REFERENCES "tuition_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
