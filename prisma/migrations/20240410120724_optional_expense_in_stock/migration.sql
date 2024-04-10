-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_expenseId_fkey";

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "expenseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE SET NULL ON UPDATE CASCADE;
