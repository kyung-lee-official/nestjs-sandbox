import { useEffect, useState } from "react";

interface IntegerInputProps {
	min?: number;
	max?: number;
	value?: number;
	onChange?: (value: number | null) => void;
	placeholder?: string;
	unit?: string;
}

export const IntegerInput = ({
	min,
	max,
	value,
	onChange,
	placeholder = "Enter an integer",
	unit,
}: IntegerInputProps) => {
	const [inputValue, setInputValue] = useState<string>(
		value?.toString() || ""
	);

	/* sync inputValue state with value prop */
	useEffect(() => {
		setInputValue(value?.toString() || "");
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;

		/* allow empty input */
		if (val === "") {
			setInputValue("");
			return;
		}

		/* allow input of just the negative sign */
		if (val === "-") {
			setInputValue(val);
			return;
		}

		/* check if the value is a valid integer */
		if (/^-?\d+$/.test(val)) {
			const intValue = parseInt(val, 10);

			/* validate against min and max */
			if (
				(min !== undefined && intValue < min) ||
				(max !== undefined && intValue > max)
			) {
				return;
			}

			setInputValue(val);
			onChange?.(intValue);
		}
	};

	const handleBlur = () => {
		/* if input is empty, set value to 0 */
		if (inputValue === "") {
			setInputValue("0");
			onChange?.(0);
			return;
		}

		/* reset to the last valid value if the input is invalid or just "-" */
		if (inputValue === "-" || !/^-?\d+$/.test(inputValue)) {
			setInputValue(value?.toString() || "0");
			onChange?.(value ?? 0);
		}
	};

	return (
		<div className="flex items-center">
			<input
				type="text"
				value={inputValue}
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder={placeholder}
				className="border border-gray-300 rounded-l px-2 py-1 flex-grow"
			/>
			{unit && (
				<span className="border border-gray-300 border-l-0 rounded-r px-2 py-1 bg-gray-100">
					{unit}
				</span>
			)}
		</div>
	);
};
