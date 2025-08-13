/*
  Warnings:

  - You are about to drop the column `examId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Question` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ExamType" AS ENUM ('PRACTICE', 'MOCK_EXAM');

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_examId_fkey";

-- AlterTable
ALTER TABLE "public"."Exam" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "examType" "public"."ExamType" NOT NULL DEFAULT 'PRACTICE';

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "examId",
DROP COLUMN "order",
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "isRealExam" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "realExamMonth" INTEGER,
ADD COLUMN     "realExamYear" INTEGER,
ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."_ExamToQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExamToQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExamToQuestion_B_index" ON "public"."_ExamToQuestion"("B");

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExamToQuestion" ADD CONSTRAINT "_ExamToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExamToQuestion" ADD CONSTRAINT "_ExamToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
