"use client";

import dayjs from "dayjs";

interface DisplayDateProps {
  date: string | null | undefined;
  format?: string;
  fallback?: string;
}

export function DisplayDate({
  date,
  format = "YYYY-MM-DD",
  fallback = "N/A",
}: DisplayDateProps) {
  if (!date) {
    return <span>{fallback}</span>;
  }

  try {
    return <span>{dayjs(date).format(format)}</span>;
  } catch {
    return <span>{fallback}</span>;
  }
}
