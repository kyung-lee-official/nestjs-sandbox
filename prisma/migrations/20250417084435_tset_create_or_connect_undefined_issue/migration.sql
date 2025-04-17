/*
  Warnings:

  - Added the required column `receiptTypeId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "receiptTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RetailSalesDataReceiptType" (
    "id" SERIAL NOT NULL,
    "receiptType" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataReceiptType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataReceiptType_receiptType_key" ON "RetailSalesDataReceiptType"("receiptType");

-- CreateIndex
CREATE INDEX "RetailSalesData_receiptTypeId_idx" ON "RetailSalesData"("receiptTypeId");

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_receiptTypeId_fkey" FOREIGN KEY ("receiptTypeId") REFERENCES "RetailSalesDataReceiptType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
