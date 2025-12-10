import { OramaClient } from "@oramacloud/client";

export const oramaClient = new OramaClient({
  endpoint: process.env.NEXT_PUBLIC_ORAMA_ENDPOINT as string,
  api_key: process.env.NEXT_PUBLIC_ORAMA_API_KEY as string,
});
