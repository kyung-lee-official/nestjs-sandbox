/*
  Warnings:

  - Added the required column `batchId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "batchId" INTEGER NOT NULL,
ADD COLUMN     "priceCny" DOUBLE PRECISION,
ADD COLUMN     "taxInclusivePriceCny" DOUBLE PRECISION,
ADD COLUMN     "unitPriceCny" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "RetailSalesDataBatch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetailSalesDataBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RetailSalesData_clientId_idx" ON "RetailSalesData"("clientId");

-- CreateIndex
CREATE INDEX "RetailSalesData_taxInclusivePriceCny_idx" ON "RetailSalesData"("taxInclusivePriceCny");

-- CreateIndex
CREATE INDEX "RetailSalesData_priceCny_idx" ON "RetailSalesData"("priceCny");

-- CreateIndex
CREATE INDEX "RetailSalesData_unitPriceCny_idx" ON "RetailSalesData"("unitPriceCny");

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "RetailSalesDataBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
