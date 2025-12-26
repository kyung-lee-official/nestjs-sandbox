import type { StoreRegionListResponse } from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export enum QK_REGION {
  LIST_REGIONS = "list_regions",
}

export async function getRegions() {
  const data = await api.get<StoreRegionListResponse>(`/store/regions`);
  return data;
}
