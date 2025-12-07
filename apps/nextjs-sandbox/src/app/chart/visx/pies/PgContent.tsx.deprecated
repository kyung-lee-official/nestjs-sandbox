"use client";

import { convertNumberToHumanReadable } from "num-guru";
import { PieChart } from "./piechart/PieChart";

const inStock = [
	{ city: "Zhuhai", inStock: 10 },
	{ city: "Zhongshan", inStock: 20 },
	{ city: "Macao", inStock: 200 },
	{ city: "Guangzhou", inStock: 500 },
	{ city: "Shenzhen", inStock: 700 },
	{ city: "Shanghai", inStock: 1000 },
	{ city: "Hongkong", inStock: 1200 },
];

const svgWidth = 1200;
const svgHeight = 500;
const margin = { top: 80, right: 80, bottom: 80, left: 80 };

export const PgContent = () => {
	const totalInStock = inStock.reduce((sum, item) => sum + item.inStock, 0);

	return (
		<div className="p-10 space-y-10">
			<PieChart
				data={inStock}
				svgWidth={svgWidth}
				svgHeight={svgHeight}
				margin={margin}
				padAngle={0.005}
				onMouseEnter={(index, data) => {
					console.log(`Hovered on arc ${index}:`, data);
				}}
				onMouseOut={(index, data) => {
					console.log(`Mouse left arc ${index}:`, data);
				}}
				valueFormatter={(value, data) => {
					return convertNumberToHumanReadable(Number(value), {
						useComma: true,
					});
				}}
				textFormatter={(value, data) => {
					const percentage = (
						(Number(data.inStock) / totalInStock) *
						100
					).toFixed(2);
					return `${data.city}, ${percentage}%`;
				}}
			/>
		</div>
	);
};
