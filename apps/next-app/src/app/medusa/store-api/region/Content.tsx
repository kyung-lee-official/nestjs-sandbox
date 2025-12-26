"use client";

import { useQuery } from "@tanstack/react-query";
import { useMIdStore } from "@/stores/medusa/medusa-entity-id";
import { getRegions, QK_REGION } from "./api";

const Content = () => {
  const regionId = useMIdStore((state) => state.regionId);
  const setRegionId = useMIdStore((state) => state.setRegionId);
  const regionsQuery = useQuery({
    queryKey: [QK_REGION.LIST_REGIONS],
    queryFn: async () => {
      const listRegionsRes = await getRegions();
      return listRegionsRes.regions;
    },
  });

  if (regionsQuery.isPending) {
    return <div>Loading...</div>;
  }
  if (regionsQuery.isError) {
    return <div>Error loading regions</div>;
  }
  return (
    <div className="m-2">
      <h1>Regions</h1>
      <ul className="flex flex-col">
        {regionsQuery.data?.map((region) => (
          <button
            type="button"
            key={region.id}
            className={`mb-2 cursor-pointer rounded border border-gray-300 p-2 text-left ${region.id === regionId ? "bg-blue-200" : "bg-white"}`}
            onClick={() => setRegionId(region.id)}
          >
            {region.name} (ID: {region.id})
          </button>
        ))}
      </ul>
    </div>
  );
};

export default Content;
