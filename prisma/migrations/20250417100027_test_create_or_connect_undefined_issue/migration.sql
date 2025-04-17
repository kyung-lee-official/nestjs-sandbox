/*
  Warnings:

  - Added the required column `platformOrderId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "platformOrderId" TEXT NOT NULL;
