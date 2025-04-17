/*
  Warnings:

  - Added the required column `nameZhCn` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformOrderId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesVolume` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storehouseId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "nameZhCn" TEXT NOT NULL,
ADD COLUMN     "platformAddressId" INTEGER,
ADD COLUMN     "platformOrderId" TEXT NOT NULL,
ADD COLUMN     "salesVolume" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "storehouseId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RetailSalesDataPlatformAddress" (
    "id" SERIAL NOT NULL,
    "platformAddress" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataPlatformAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailSalesDataStorehouse" (
    "id" SERIAL NOT NULL,
    "storehouse" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataStorehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailSalesDataCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataPlatformAddress_platformAddress_key" ON "RetailSalesDataPlatformAddress"("platformAddress");

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataStorehouse_storehouse_key" ON "RetailSalesDataStorehouse"("storehouse");

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataCategory_category_key" ON "RetailSalesDataCategory"("category");

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_platformAddressId_fkey" FOREIGN KEY ("platformAddressId") REFERENCES "RetailSalesDataPlatformAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_storehouseId_fkey" FOREIGN KEY ("storehouseId") REFERENCES "RetailSalesDataStorehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RetailSalesDataCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
