-- CreateIndex
CREATE INDEX "RetailSalesData_departmentId_idx" ON "RetailSalesData"("departmentId");

-- CreateIndex
CREATE INDEX "RetailSalesData_skuId_nameZhCn_idx" ON "RetailSalesData"("skuId", "nameZhCn");

-- CreateIndex
CREATE INDEX "RetailSalesData_salesVolume_idx" ON "RetailSalesData"("salesVolume");

-- CreateIndex
CREATE INDEX "RetailSalesData_platformAddressId_idx" ON "RetailSalesData"("platformAddressId");

-- CreateIndex
CREATE INDEX "RetailSalesData_platformOrderId_idx" ON "RetailSalesData"("platformOrderId");

-- CreateIndex
CREATE INDEX "RetailSalesData_storehouseId_idx" ON "RetailSalesData"("storehouseId");

-- CreateIndex
CREATE INDEX "RetailSalesData_categoryId_idx" ON "RetailSalesData"("categoryId");
