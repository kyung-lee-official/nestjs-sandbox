import Link from "next/link";

type InventoryLevelsProps = {
	inventoryLevels: any[];
};

export const InventoryLevels = (props: InventoryLevelsProps) => {
	const { inventoryLevels } = props;
	return (
		<div
			className="p-3 space-y-2
			bg-neutral-200
			rounded"
		>
			<h1>InventoryLevels</h1>
			{inventoryLevels && inventoryLevels.length > 0 ? (
				inventoryLevels.map((level) => (
					<details
						key={level.id}
						className="p-2
						bg-neutral-300
						rounded"
					>
						<summary className="cursor-pointer">
							<div>Inventory Level ID: {level.id}</div>
							Stock Location:{" "}
							<Link
								href={`/medusa/commerce-modules/stock-location/${level.stock_location.id}`}
								className="underline decoration-dotted"
							>
								{level.stock_location.name} (
								{level.stock_location.id})
							</Link>
						</summary>
						<p>Stocked Quantity: {level.stocked_quantity}</p>
						<p>Reserved Quantity: {level.reserved_quantity}</p>
						<p>Incoming Quantity: {level.incoming_quantity}</p>
						<p>Available Quantity: {level.available_quantity}</p>
					</details>
				))
			) : (
				<p>No inventory levels found.</p>
			)}
		</div>
	);
};
