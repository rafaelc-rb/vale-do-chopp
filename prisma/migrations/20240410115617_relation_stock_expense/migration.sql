/*
  Warnings:

  - A unique constraint covering the columns `[expenseId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expenseId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "expenseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_expenseId_key" ON "Stock"("expenseId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
