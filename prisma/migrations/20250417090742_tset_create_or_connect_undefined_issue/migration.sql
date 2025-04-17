/*
  Warnings:

  - You are about to drop the column `receiptType` on the `RetailSalesDataReceiptType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `RetailSalesDataReceiptType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `RetailSalesDataReceiptType` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RetailSalesDataReceiptType_receiptType_key";

-- AlterTable
ALTER TABLE "RetailSalesDataReceiptType" DROP COLUMN "receiptType",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataReceiptType_type_key" ON "RetailSalesDataReceiptType"("type");
