-- CreateTable
CREATE TABLE "UploadLargeXlsxBatch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadLargeXlsxBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadLargeXlsxData" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "bioId" TEXT NOT NULL,

    CONSTRAINT "UploadLargeXlsxData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UploadLargeXlsxData_batchId_idx" ON "UploadLargeXlsxData"("batchId");

-- AddForeignKey
ALTER TABLE "UploadLargeXlsxData" ADD CONSTRAINT "UploadLargeXlsxData_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "UploadLargeXlsxBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
