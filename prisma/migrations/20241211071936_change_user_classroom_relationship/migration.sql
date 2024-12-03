/*
  Warnings:

  - The `social_links` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `user_id` on the `user_classrooms` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `classrooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `classrooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `user_classrooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `user_classrooms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "user_classrooms" DROP CONSTRAINT "user_classrooms_classroom_id_fkey";

-- DropForeignKey
ALTER TABLE "user_classrooms" DROP CONSTRAINT "user_classrooms_user_id_fkey";

-- AlterTable
ALTER TABLE "classrooms" ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "lessons" ALTER COLUMN "topic" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "social_links",
ADD COLUMN     "social_links" TEXT[];

-- AlterTable
ALTER TABLE "user_classrooms" DROP COLUMN "user_id",
ADD COLUMN     "status" "StudentStatus",
ADD COLUMN     "student_id" INTEGER NOT NULL,
ADD COLUMN     "teacher_id" INTEGER NOT NULL,
ALTER COLUMN "classroom_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_classrooms" ADD CONSTRAINT "user_classrooms_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classrooms" ADD CONSTRAINT "user_classrooms_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classrooms" ADD CONSTRAINT "user_classrooms_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
