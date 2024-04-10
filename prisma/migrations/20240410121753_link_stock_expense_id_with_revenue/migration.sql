/*
  Warnings:

  - A unique constraint covering the columns `[expenseId]` on the table `Revenue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expenseId` to the `Revenue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Revenue" ADD COLUMN     "expenseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Revenue_expenseId_key" ON "Revenue"("expenseId");

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
