import React, { useEffect, useState } from "react";
import DialogInput from "react-native-dialog-input";
import { STRINGS } from "../../Constants/Strings";
import { createLabel } from "../../Utils";
import withTheme from "../HOC";
import { addLabelProps } from "./types";

function AddLabel({ uid, show, setShow, theme }: addLabelProps) {
  const [newLabelName, setNewLabelName] = useState<string>('');
  useEffect(() => {
    const regex = /^\s$/
    if (uid && !regex.test(newLabelName)) createLabel(uid, newLabelName);
  }, [newLabelName]);
  // setShow(true)
  return (
    <DialogInput
      isDialogVisible={show}
      title={STRINGS.ADD_LABEL}
      hintInput={STRINGS.LABEL_NAME}
      hintTextColor="rgb(9,9,10)"
      dialogStyle={{}}
      modalStyle={{}}
      textInputProps={{ maxLength: 20 }}
      submitInput={(input: string) => {
        setNewLabelName(input);
      }}
      closeDialog={() => {
        setShow(false);
      }}
    ></DialogInput>
  );
}

export default withTheme(AddLabel);
