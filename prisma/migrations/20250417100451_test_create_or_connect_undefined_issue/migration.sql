/*
  Warnings:

  - Added the required column `storehouseId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "storehouseId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RetailSalesDataStorehouse" (
    "id" SERIAL NOT NULL,
    "storehouse" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataStorehouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataStorehouse_storehouse_key" ON "RetailSalesDataStorehouse"("storehouse");

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_storehouseId_fkey" FOREIGN KEY ("storehouseId") REFERENCES "RetailSalesDataStorehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
