import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { EditContentRegular } from "./EditContentRegular";
import { EditId, type EditProps } from "./EditPanel";

export const EditContentEmail = (props: {
  edit: EditProps;
  setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
  const editId = EditId.EMAIL;
  const title = "Email";
  const { edit, setEdit } = props;

  const [oldData, setOldData] = useState<any>({ email: "kyung.lee@qq.com" });
  const [newData, setNewData] = useState<any>(oldData);
  const [email, setEmail] = useState<string>(oldData.email);

  useEffect(() => {
    setNewData({
      email: email,
    });
  }, [email]);

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
      <form action={onSave} className="flex flex-col px-6 py-4 gap-6">
        <div
          className="flex flex-col gap-1.5
					text-sm"
        >
          Email
          <input
            type="text"
            className="px-2 py-1.5
						bg-white/10
						rounded-md outline-none
						border-[1px] border-white/10"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
      </form>
    </EditContentRegular>
  );
};
