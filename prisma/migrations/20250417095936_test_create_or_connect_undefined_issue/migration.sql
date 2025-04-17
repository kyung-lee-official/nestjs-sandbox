/*
  Warnings:

  - You are about to drop the column `categoryId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `platformOrderId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `storehouseId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the `RetailSalesDataCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetailSalesDataStorehouse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_storehouseId_fkey";

-- AlterTable
ALTER TABLE "RetailSalesData" DROP COLUMN "categoryId",
DROP COLUMN "platformOrderId",
DROP COLUMN "storehouseId";

-- DropTable
DROP TABLE "RetailSalesDataCategory";

-- DropTable
DROP TABLE "RetailSalesDataStorehouse";
