import { useQuery } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { Dropdown } from "@/app/styles/dropdown/universal-dropdown/dropdown/Dropdown";
import { setRegionCookie } from "../../actions";
import { getRegions, RegionQK } from "./api";

type RegionProps = {
  regionId: string | undefined;
};

export const Region = (props: RegionProps) => {
  const { regionId } = props;
  const [selectedRegionId, setSelectedRegionId] = useState<
    string | string[] | null
  >(regionId || null);
  const [isPending, startTransition] = useTransition();

  const regionQuery = useQuery({
    queryKey: [RegionQK.GET_REGION_LIST],
    queryFn: async () => {
      const res = await getRegions();
      return res;
    },
  });

  const handleRegionChange = (
    newRegion:
      | string
      | string[]
      | null
      | ((prevState: string | string[] | null) => string | string[] | null),
  ) => {
    const regionValue =
      typeof newRegion === "function" ? newRegion(selectedRegionId) : newRegion;
    setSelectedRegionId(regionValue);

    if (typeof regionValue === "string") {
      startTransition(async () => {
        try {
          await setRegionCookie(regionValue);
          /* optionally refresh the page to reflect the new region */
          window.location.reload();
        } catch (error) {
          console.error("Failed to set region cookie:", error);
        }
      });
    }
  };

  if (regionQuery.isLoading) {
    return <div>Loading Regions...</div>;
  }

  if (regionQuery.isError) {
    return <div>Error loading Regions</div>;
  }

  return (
    <Dropdown
      mode="regular"
      options={regionQuery.data.map((region: any) => region.id)}
      selected={selectedRegionId}
      setSelected={handleRegionChange}
      placeholder="Select a region"
      getLabel={(option: string) => {
        const label = regionQuery.data.find(
          (region: any) => region.id === option,
        )?.name;
        return label || option;
      }}
      optionWrapperClassName={(option, { selected, hovered }) => {
        return `px-2 py-1
						${hovered ? "bg-neutral-700" : ""}}
						cursor-pointer truncate`;
      }}
      renderOption={(option: string, state) => {
        const label = regionQuery.data.find(
          (region: any) => region.id === option,
        )?.name;
        return (
          <div
            className={`px-3 py-2 cursor-pointer ${
              state.hovered ? "bg-neutral-400" : ""
            } ${state.selected ? "bg-neutral-500" : ""}`}
          >
            {label}
          </div>
        );
      }}
      selectedItemClassName={(option) => "text-white truncate"}
      controlClassName="flex items-center flex-wrap min-h-8 px-2 py-1 gap-2
			bg-neutral-800
			border-1 border-neutral-700 rounded-md cursor-pointer"
      placeholderClassName="text-neutral-400 truncate"
      menuClassName="absolute z-10 w-full mt-1
			text-white/60
			bg-neutral-800
			border border-neutral-700 rounded-md overflow-auto"
    />
  );
};
