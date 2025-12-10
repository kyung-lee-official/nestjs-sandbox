import { useQuery } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { Dropdown } from "@/app/styles/dropdown/universal-dropdown/dropdown/Dropdown";
import { setSalesChannelCookie } from "../../actions";
import { getSalesChannelList, SalesChannelQK } from "./api";

type SalesChannelProps = {
  salesChannelId: string | undefined;
};

export const SalesChannel = (props: SalesChannelProps) => {
  const { salesChannelId } = props;
  const [selectedSalesChannelId, setSelectedSalesChannelId] = useState<
    string | string[] | null
  >(salesChannelId || null);
  const [isPending, startTransition] = useTransition();

  const salesChannelQuery = useQuery({
    queryKey: [SalesChannelQK.GET_SALES_CHANNEL_LIST],
    queryFn: async () => {
      const res = await getSalesChannelList();
      return res;
    },
  });

  const handleSalesChannelChange = (
    newSalesChannel:
      | string
      | string[]
      | null
      | ((prevState: string | string[] | null) => string | string[] | null),
  ) => {
    const salesChannelValue =
      typeof newSalesChannel === "function"
        ? newSalesChannel(selectedSalesChannelId)
        : newSalesChannel;
    setSelectedSalesChannelId(salesChannelValue);

    if (typeof salesChannelValue === "string") {
      startTransition(async () => {
        try {
          await setSalesChannelCookie(salesChannelValue);
          /* optionally refresh the page to reflect the new sales channel */
          window.location.reload();
        } catch (error) {
          console.error("Failed to set sales channel cookie:", error);
        }
      });
    }
  };

  if (salesChannelQuery.isLoading) {
    return <div>Loading Sales Channels...</div>;
  }

  if (salesChannelQuery.isError) {
    return <div>Error loading Sales Channels</div>;
  }

  return (
    <Dropdown
      mode="regular"
      options={salesChannelQuery.data.map(
        (salesChannel: any) => salesChannel.id,
      )}
      selected={selectedSalesChannelId}
      setSelected={handleSalesChannelChange}
      placeholder="Select a sales channel"
      getLabel={(option: string) => {
        const label = salesChannelQuery.data.find(
          (salesChannel: any) => salesChannel.id === option,
        )?.name;
        return label || option;
      }}
      optionWrapperClassName={(option, { selected, hovered }) => {
        return `px-2 py-1
						${hovered ? "bg-neutral-700" : ""}}
						cursor-pointer truncate`;
      }}
      renderOption={(option: string, state) => {
        const label = salesChannelQuery.data.find(
          (salesChannel: any) => salesChannel.id === option,
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
