/* Validate file before upload */
export const validateFile = (
  file: File,
): { valid: boolean; error?: string } => {
  /* Check file type */
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" /* .xlsx */,
    "application/vnd.ms-excel" /* .xls */,
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload an Excel file (.xlsx or .xls)",
    };
  }

  /* Check file size (max 50MB) */
  const maxSize = 50 * 1024 * 1024; /* 50MB in bytes */
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size too large. Maximum size is 50MB",
    };
  }

  /* Check if file is empty */
  if (file.size === 0) {
    return {
      valid: false,
      error: "File is empty",
    };
  }

  return { valid: true };
};
