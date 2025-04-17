/*
  Warnings:

  - You are about to drop the column `categoryId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `nameZhCn` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `platformAddressId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `platformOrderId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `priceCny` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `receiptTypeId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `salesVolume` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `skuId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `storehouseId` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `taxInclusivePriceCny` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the column `unitPriceCny` on the `RetailSalesData` table. All the data in the column will be lost.
  - You are about to drop the `RetailSalesDataCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetailSalesDataClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetailSalesDataDepartment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetailSalesDataPlatformAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetailSalesDataReceiptType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetailSalesDataSku` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetailSalesDataStorehouse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_clientId_fkey";

-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_platformAddressId_fkey";

-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_receiptTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_skuId_fkey";

-- DropForeignKey
ALTER TABLE "RetailSalesData" DROP CONSTRAINT "RetailSalesData_storehouseId_fkey";

-- DropIndex
DROP INDEX "RetailSalesData_categoryId_idx";

-- DropIndex
DROP INDEX "RetailSalesData_clientId_idx";

-- DropIndex
DROP INDEX "RetailSalesData_departmentId_idx";

-- DropIndex
DROP INDEX "RetailSalesData_platformAddressId_idx";

-- DropIndex
DROP INDEX "RetailSalesData_platformOrderId_idx";

-- DropIndex
DROP INDEX "RetailSalesData_priceCny_idx";

-- DropIndex
DROP INDEX "RetailSalesData_receiptTypeId_idx";

-- DropIndex
DROP INDEX "RetailSalesData_salesVolume_idx";

-- DropIndex
DROP INDEX "RetailSalesData_skuId_nameZhCn_idx";

-- DropIndex
DROP INDEX "RetailSalesData_storehouseId_idx";

-- DropIndex
DROP INDEX "RetailSalesData_taxInclusivePriceCny_idx";

-- DropIndex
DROP INDEX "RetailSalesData_unitPriceCny_idx";

-- AlterTable
ALTER TABLE "RetailSalesData" DROP COLUMN "categoryId",
DROP COLUMN "clientId",
DROP COLUMN "departmentId",
DROP COLUMN "nameZhCn",
DROP COLUMN "platformAddressId",
DROP COLUMN "platformOrderId",
DROP COLUMN "priceCny",
DROP COLUMN "receiptTypeId",
DROP COLUMN "salesVolume",
DROP COLUMN "skuId",
DROP COLUMN "storehouseId",
DROP COLUMN "taxInclusivePriceCny",
DROP COLUMN "unitPriceCny";

-- DropTable
DROP TABLE "RetailSalesDataCategory";

-- DropTable
DROP TABLE "RetailSalesDataClient";

-- DropTable
DROP TABLE "RetailSalesDataDepartment";

-- DropTable
DROP TABLE "RetailSalesDataPlatformAddress";

-- DropTable
DROP TABLE "RetailSalesDataReceiptType";

-- DropTable
DROP TABLE "RetailSalesDataSku";

-- DropTable
DROP TABLE "RetailSalesDataStorehouse";
