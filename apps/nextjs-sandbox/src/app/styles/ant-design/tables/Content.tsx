"use client";

import { Table } from "antd";

const ColSpanRowSpan = () => {
	const columns = [
		{
			title: "colSpan 3",
			dataIndex: "col1",
			rowScope: "row",
			colSpan: 3,
			onCell: (_: undefined, index: number) => {
				if (index === 1) {
					return { rowSpan: 2 };
				}
				if (index === 2) {
					return { rowSpan: 0 };
				}
			},
		},
		{
			dataIndex: "col2",
			colSpan: 0,
		},
		{
			dataIndex: "col3",
			colSpan: 0,
		},
		{
			dataIndex: "col4",
			title: "colSpan 2",
			colSpan: 2,
			onCell: (_: undefined, index: number) => {
				if (index === 1) {
					return { colSpan: 2 };
				}
				if (index === 2) {
					return { rowSpan: 2 };
				}
				if (index === 3) {
					return { rowSpan: 0 };
				}
			},
		},
		{
			colSpan: 0,
			dataIndex: "col5",
			onCell: (_: undefined, index: number) => {
				if (index === 1) {
					return { colSpan: 0 };
				}
			},
		},
	];

	const data = [
		{
			key: "1",
			col1: "John Brown",
			col2: 32,
			col3: "0571-22098909",
			col4: 18889898989,
			col5: "New York No. 1 Lake Park",
		},
		{
			key: "2",
			col1: "Jim Green",
			col3: "0571-22098333",
			col4: 18889898888,
			col2: 42,
			col5: "London No. 1 Lake Park",
		},
		{
			key: "3",
			col1: "Joe Black",
			col2: 32,
			col3: "0575-22098909",
			col4: 18900010002,
			col5: "Sydney No. 1 Lake Park",
		},
		{
			key: "4",
			col1: "Jim Red",
			col2: 18,
			col3: "0575-22098909",
			col4: 18900010002,
			col5: "London No. 2 Lake Park",
		},
		{
			key: "5",
			col1: "Jake White",
			col2: 18,
			col3: "0575-22098909",
			col4: 18900010002,
			col5: "Dublin No. 2 Lake Park",
		},
	];

	return <Table columns={columns as any} dataSource={data} bordered />;
};

const ScrollX = () => {
	const columns = [
		{
			title: <div className="Whitespace-nowrap">Scroll X</div>,
			dataIndex: "col1",
		},
		{
			dataIndex: "col2",
		},
		{
			dataIndex: "col3",
		},
		{
			dataIndex: "col4",
		},
		{
			dataIndex: "col5",
		},
		{
			dataIndex: "col6",
		},
	];

	const data = [
		{
			key: "1",
			col1: <div className="Whitespace-nowrap">John Brown</div>,
			col2: 32,
			col3: <div className="whitespace-nowrap">0571-22098909</div>,
			col4: 18889898989,
			col5: (
				<div className="whitespace-nowrap">
					New York No. 1 Lake Park
				</div>
			),
			col6: "male",
		},
		{
			key: "2",
			col1: <div className="Whitespace-nowrap">Jim Green</div>,
			col3: <div className="whitespace-nowrap">0571-22098333</div>,
			col4: 18889898888,
			col2: 42,
			col5: (
				<div className="whitespace-nowrap">London No. 1 Lake Park</div>
			),
			col6: "male",
		},
		{
			key: "3",
			col1: <div className="Whitespace-nowrap">Joe Black</div>,
			col2: 32,
			col3: <div className="whitespace-nowrap">0575-22098909</div>,
			col4: 18900010002,
			col5: (
				<div className="whitespace-nowrap">Sydney No. 1 Lake Park</div>
			),
			col6: "male",
		},
		{
			key: "4",
			col1: <div className="Whitespace-nowrap">Jim Red</div>,
			col2: 18,
			col3: <div className="whitespace-nowrap">0575-22098909</div>,
			col4: 18900010002,
			col5: (
				<div className="whitespace-nowrap">London No. 2 Lake Park</div>
			),
			col6: "male",
		},
		{
			key: "5",
			col1: <div className="Whitespace-nowrap">Jake White</div>,
			col2: 18,
			col3: <div className="whitespace-nowrap">0575-22098909</div>,
			col4: 18900010002,
			col5: (
				<div className="whitespace-nowrap">Dublin No. 2 Lake Park</div>
			),
			col6: "male",
		},
	];

	return (
		<Table
			columns={columns as any}
			dataSource={data}
			bordered
			scroll={{ x: 1000 }}
		/>
	);
};

const Content = () => {
	return (
		<div className="flex flex-col w-full mx-auto p-10 gap-10">
			<div className="flex flex-col w-full gap-6">
				<h1 className="text-xl">colSpan and rowSpan</h1>
				<h6 className="text-sm text-gray-400">
					Note: Ant Design cannot work with vanilla CSS, for example,
					it&apos;s not possible to change header style without using
					JS
				</h6>
				<ColSpanRowSpan />
			</div>
			<div className="flex flex-col w-full gap-6">
				<h1 className="text-xl">x scroll</h1>
				<h6
					className="flex flex-col items-start gap-2
					text-sm text-gray-400"
				>
					<div>
						Should avoid adding &quot;100vw&quot; to the `body` tag,
						it will cause the right edge of the `body` tag to be
						hidden by the vertical scrollbar:
					</div>
					<img src="/images/antd/tables/001.png" alt="overflow-x" />
					<div>
						If flexbox is used as the container, the flex item
						should be set to `min-width: 0` to allow the content to
						overflow the container. See{" "}
						<a href="/styles/OverflowXPage" className="underline">
							OverflowXPage
						</a>{" "}
						for details.
					</div>
				</h6>
				<ScrollX />
			</div>
		</div>
	);
};

export default Content;
