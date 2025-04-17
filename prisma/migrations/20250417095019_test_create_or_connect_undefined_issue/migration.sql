/*
  Warnings:

  - Added the required column `clientId` to the `RetailSalesData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetailSalesData" ADD COLUMN     "clientId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RetailSalesDataClient" (
    "id" SERIAL NOT NULL,
    "client" TEXT NOT NULL,

    CONSTRAINT "RetailSalesDataClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RetailSalesDataClient_client_key" ON "RetailSalesDataClient"("client");

-- AddForeignKey
ALTER TABLE "RetailSalesData" ADD CONSTRAINT "RetailSalesData_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "RetailSalesDataClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
