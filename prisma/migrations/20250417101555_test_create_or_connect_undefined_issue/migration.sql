/*
  Warnings:

  - You are about to drop the column `batchId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the `RetailSalesDataBatch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_batchId_fkey";

-- AlterTable
ALTER TABLE "RetailSalesData" DROP COLUMN "batchId";

-- DropTable
DROP TABLE "RetailSalesDataBatch";
