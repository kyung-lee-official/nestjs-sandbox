import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "./EditPanel";
import { EditContentRegular } from "./EditContentRegular";

export const EditContentName = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.NAME;
	const title = "Name";
	const { edit, setEdit } = props;

	const [oldData, setOldData] = useState<any>({ name: "Kyung Lee" });
	const [newData, setNewData] = useState<any>(oldData);
	const [name, setName] = useState<string>(oldData.name);

	useEffect(() => {
		setNewData({
			name: name,
		});
	}, [name]);

	function onSave() {
		/* here we call API to update the data */
		// mutation.mutate();
	}

	return (
		<EditContentRegular
			title={title}
			editId={editId}
			edit={edit}
			setEdit={setEdit}
			onSave={onSave}
			newData={newData}
			oldData={oldData}
		>
			<form action={onSave} className="flex flex-col px-6 py-4">
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Name
					<input
						type="text"
						className="px-2 py-1.5
						bg-white/10
						rounded-md outline-none
						border-[1px] border-white/10"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				</div>
			</form>
		</EditContentRegular>
	);
};
