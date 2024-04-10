/*
  Warnings:

  - A unique constraint covering the columns `[expenseId]` on the table `PersonalUse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `PersonalUse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expenseId` to the `PersonalUse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonalUse" ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "expenseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PersonalUse_expenseId_key" ON "PersonalUse"("expenseId");

-- AddForeignKey
ALTER TABLE "PersonalUse" ADD CONSTRAINT "PersonalUse_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
