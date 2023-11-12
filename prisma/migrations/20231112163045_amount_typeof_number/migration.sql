/*
  Warnings:

  - Changed the type of `amount` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `amount` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amount` on the `PersonalUse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `Revenue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `Stock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "item" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PersonalUse" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;
