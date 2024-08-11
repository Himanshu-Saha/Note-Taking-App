import { useRealm } from "@realm/react";
import React, { useEffect, useState } from "react";
import DialogInput from "react-native-dialog-input";
import { useSelector } from "react-redux";
import { STRINGS } from "../../Constants/Strings";
import { RootState } from "../../Store";
import { addLabelToRealm, createLabel } from "../../Utils";
import withTheme from "../HOC";
import { addLabelProps } from "./types";

function AddLabel({ uid, show, setShow, theme }: addLabelProps) {
  const [newLabelName, setNewLabelName] = useState<string>();
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const isNetworkAvalible = useSelector(
    (state: RootState) => state.network.isAvailable
  );
  const realm = useRealm();
  useEffect(() => {
    if (newLabelName) {
      const regex = /^[\s\u00A0\xA0]*$/;
      if (uid && !regex.test(newLabelName)) {
        if (!isLoading && isNetworkAvalible) createLabel(uid, newLabelName);
        else {
          addLabelToRealm(newLabelName, realm);
        }
      }
    }
  }, [newLabelName]);
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
