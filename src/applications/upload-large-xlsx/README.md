# Upload Large XLSX

This module handles large XLSX file uploads with background processing using BullMQ queues.

## Queue Structure (upload-large-xlsx.queue folder)

-   **interfaces.ts** - Shared interfaces for job data types
-   **processing.processor.ts** - Handles file processing (workbook loading, header validation, data extraction)
-   **validation.processor.ts** - Handles chunk validation of extracted data
-   **saving.processor.ts** - Handles saving validated data to database

## Processors

### ProcessingProcessor

-   Queue: `upload-xlsx-processing`
-   Handles workbook loading and header validation
-   Extracts row data and queues validation jobs

### ValidationProcessor

-   Queue: `upload-xlsx-validation`
-   Validates data chunks using Zod schema
-   Tracks validation progress and errors

### SavingProcessor

-   Queue: `upload-xlsx-saving`
-   Saves validated data chunks to database
-   Tracks saving progress and completion

## Job Flow

1. File uploaded → ProcessingProcessor (workbook loading + header validation)
2. Data extracted → ValidationProcessor (chunk validation)
3. Valid data → SavingProcessor (database saving)

Each step provides real-time status updates via Socket.IO through the gateway.
