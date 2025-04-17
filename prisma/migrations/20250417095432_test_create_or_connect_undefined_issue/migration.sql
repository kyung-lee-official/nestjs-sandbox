/*
  Warnings:

  - Added the required column `departmentId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "departmentId" INTEGER NOT NULL,
ADD COLUMN     "skuId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RetailSalesDataDepartment" (
    "id" SERIAL NOT NULL,
    "department" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailSalesDataSku" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataSku_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataDepartment_department_key" ON "RetailSalesDataDepartment"("department");

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataSku_sku_key" ON "RetailSalesDataSku"("sku");

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "RetailSalesDataDepartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "RetailSalesDataSku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
