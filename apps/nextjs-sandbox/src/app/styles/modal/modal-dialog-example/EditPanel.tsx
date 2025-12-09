import { motion } from "motion/react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { EditContentName } from "./EditContentName";
import { EditContentEmail } from "./EditContentEmail";

export enum EditId {
	NAME = "name",
	EMAIL = "email",
}

export type EditProps = {
	show: boolean;
	id: EditId;
	auxData?: any;
};

const DarkenMask = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<motion.div
			initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
			animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
			className="absolute top-0 right-0 bottom-0 left-0 z-10
			overflow-hidden"
		>
			{children}
		</motion.div>
	);
};

const EditContent = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const { edit, setEdit } = props;
	switch (edit.id) {
		case EditId.NAME:
			return <EditContentName edit={edit} setEdit={setEdit} />;
		case EditId.EMAIL:
			return <EditContentEmail edit={edit} setEdit={setEdit} />;
		default:
			return null;
	}
};

export const EditPanel = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const { edit, setEdit } = props;
	if (edit.show) {
		return (
			<DarkenMask>
				<EditContent edit={edit} setEdit={setEdit} />
			</DarkenMask>
		);
	} else {
		return null;
	}
};
