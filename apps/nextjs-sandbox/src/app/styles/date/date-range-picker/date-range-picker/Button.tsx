import { Dispatch, SetStateAction } from "react";
import { CalendarRange } from "./Calendar";
import dayjs from "dayjs";

export const Button = (props: {
	children: React.ReactNode;
	date: dayjs.Dayjs;
	isFade: boolean;
	isStartOrEnd: boolean;
	isBetween: boolean;
	calendarRange: CalendarRange;
	setCalendarRange: Dispatch<SetStateAction<CalendarRange>>;
}) => {
	const {
		children,
		date,
		isFade,
		isStartOrEnd,
		isBetween,
		calendarRange,
		setCalendarRange,
	} = props;

	const onClick = () => {
		setCalendarRange((prev) => {
			if (!prev.isSelecting) {
				/* if not currently selecting a range, start selecting */
				return {
					/* ensure the start date is at the beginning of the day */
					start: date.startOf("day"),
					/* temporarily set the end date to the same date */
					end: date.endOf("day"),
					isSelecting: true,
				};
			} else {
				/* if currently selecting a range, update the range */
				if (prev.start.isAfter(date)) {
					/* if the start date is after the clicked date, set the start date to the clicked date */
					return {
						start: date.startOf("day"),
						end: prev.start.endOf("day"),
						isSelecting: false,
					};
				} else {
					/* if the start date is before or same as the clicked date, set the end date to the clicked date */
					return {
						start: prev.start.startOf("day"),
						end: date.endOf("day"),
						isSelecting: false,
					};
				}
			}
		});
	};

	if (isStartOrEnd) {
		return (
			<button
				className="w-7 h-7
				text-white
				bg-blue-500
				rounded-full cursor-pointer"
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	if (isBetween) {
		return (
			<button
				className="w-7 h-7
				text-blue-500
				bg-blue-500/30
				rounded-full cursor-pointer"
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	if (isFade) {
		return (
			<button
				className="w-7 h-7
				text-white/40
				rounded-full cursor-pointer"
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	return (
		<button
			className="w-7 h-7
			text-white
			rounded-full cursor-pointer"
			onClick={onClick}
		>
			{children}
		</button>
	);
};
