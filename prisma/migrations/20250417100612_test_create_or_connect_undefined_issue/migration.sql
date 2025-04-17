-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "RetailSalesDataCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataCategory_category_key" ON "RetailSalesDataCategory"("category");

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RetailSalesDataCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
