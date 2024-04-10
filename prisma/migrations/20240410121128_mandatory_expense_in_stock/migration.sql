/*
  Warnings:

  - Made the column `expenseId` on table `Stock` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_expenseId_fkey";

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "expenseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
