"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { DatePicker } from "./date-picker/DatePicker";
import { MonthPicker } from "./month-picker/MonthPicker";
import { YearPicker } from "./year-picker/YearPicker";

const Content = () => {
	const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
	const [month, setMonth] = useState<dayjs.Dayjs>(
		dayjs(dayjs().format("YYYY-MM"))
	);
	const [year, setYear] = useState<dayjs.Dayjs>(
		dayjs(dayjs().format("YYYY"))
	);

	console.log(dayjs("2025-01-01").toISOString());
	console.log(dayjs("2025-01-01").format("YYYY-MM-DD"));

	return (
		<div className="flex flex-col gap-3">
			<h1 className="text-lg">Time consistency</h1>
			<div
				className="w-1/2 p-3
				border-dashed border-black border-2"
			>
				<p>
					When dealing with time, you should always assume that server
					only accepts UTC time, because the server side does not know
					the timezone of the client.
				</p>
				<div>
					<h2
						className="p-1 mb-4
						border-dashed border-black border-2"
					>
						date picker {date.toISOString()}
					</h2>
					<DatePicker date={date} setDate={setDate} />
				</div>
			</div>
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
				<div className="mb-4">
					<h2
						className="p-1 mb-4
						border-dashed border-black border-2"
					>
						month picker {month.toISOString()} -{" "}
						{month.add(1, "month").toISOString()}
					</h2>
					<MonthPicker date={month} setDate={setMonth} />
				</div>
				<div>
					<h2
						className="p-1 mb-4
						border-dashed border-black border-2"
					>
						year picker {year.toISOString()} -{" "}
						{year.add(1, "year").toISOString()}
					</h2>
					<YearPicker date={year} setDate={setYear} />
				</div>
			</div>
			<div
				className="w-1/2 p-3
				border-dashed border-black border-2"
			>
				<p>
					There is another scenario to consider, where we do not care
					about the timezone, for example, our timezone is UTC+8, we
					want to create an entity for each month. Essentially time is
					always UTC, it is just represented in your local time
					depending on your timezone.
				</p>
				<p>
					The <code>toISOString()</code> method of dayjs will always
					return the UTC time, while the <code>format()</code> method
					will return the local. With this in mind, we can simply
					turns the <code>date</code> (
					<code>2024-12-31T16:00:00.000Z</code>) from month picker
					into string <code>2025-01-01</code> by calling
				</p>
				<p>
					<code>
						date.format(&quot;YYYY-MM-DD&quot;) /* 2025-01-01 */
					</code>
				</p>
				<p>
					This string should be used as the identifier of the entity
					when sending requests to the server. When saving to
					database, we convert the string to a UTC time by calling
				</p>
				<p>
					<code>
						dayjs(&quot;2025-01-01&quot;).toISOString() /*
						2025-01-01T00:00:00.000Z */
					</code>
				</p>
				<p>which makes it easy for time comparison (filtering).</p>
				<p>
					When it comes to searching, we literally repeat the similar
					thing. So if we wants all entities of year 2025, we first
					send string &quot;2025-01-01&quot; to the server, and the
					server will convert it to
					&quot;2025-01-01T00:00:00.000Z&quot; before querying the
					database.
				</p>
			</div>
		</div>
	);
};

export default Content;
