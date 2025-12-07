"use client";

import dayjs from "dayjs";
import {
	DateRange,
	DateRangePicker,
} from "./date-range-picker/DateRangePicker";
import { useState } from "react";

export const Content = () => {
	const [range, setRange] = useState<DateRange>({
		start: dayjs().startOf("month"),
		end: dayjs().endOf("month"),
	});

	return (
		<div>
			<h1 className="text-lg">Time consistency</h1>
			<div
				className="w-1/2 p-3
				border-dashed border-black border-2"
			>
				<p>
					Time inconsistency could happen when referring to a time
					range instead of a specific time. For example, year and
					month.
				</p>
				<p>
					Let us say your timezone is UTC+8, and an entity is created
					at 2025-01-01 01:00:00 (local), the corresponding UTC time
					in database will be 2024-12-31T17:00:00.000Z, if your try to
					search entities created in year 2025, you are actually
					searching entities created at 2024-12-31T16:00:00.000Z to
					2025-12-31T15:59:59.999Z, which gives you correct results
					based on your timezone.
				</p>
				<p>
					That is to say, when searching entities within a time range,
					you should always specify the start and end time before
					sending the request. Because the frontend knows the timezone
					of the user, while the backend does not.
				</p>
				<p>
					You cannot say{" "}
					<i>hey server, give me entities created in year 2025</i>,
					because the <b>server does not know your timezone</b>.
				</p>
				<h2
					className="p-1 mb-4
					border-dashed border-black border-2"
				>
					date range picker {range.start.toISOString()} -{" "}
					{range.end.toISOString()}
				</h2>
				<DateRangePicker range={range} setRange={setRange} />
			</div>
		</div>
	);
};
