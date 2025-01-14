/*
  Warnings:

  - You are about to alter the column `code` on the `classrooms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(6)`.

*/
-- DropForeignKey
ALTER TABLE "user_classrooms" DROP CONSTRAINT "user_classrooms_student_id_fkey";

-- DropForeignKey
ALTER TABLE "user_classrooms" DROP CONSTRAINT "user_classrooms_teacher_id_fkey";

-- AlterTable
ALTER TABLE "classrooms" ALTER COLUMN "code" SET DATA TYPE CHAR(6),
ALTER COLUMN "total_student" SET DEFAULT 0,
ALTER COLUMN "total_teacher" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "user_classrooms" ALTER COLUMN "student_id" DROP NOT NULL,
ALTER COLUMN "teacher_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_classrooms" ADD CONSTRAINT "user_classrooms_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classrooms" ADD CONSTRAINT "user_classrooms_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
