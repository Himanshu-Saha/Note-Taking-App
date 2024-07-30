// CustomDialogInput.js
import React, { useState } from "react";
import Dialog from "react-native-dialog";
import { COLORS } from "../../Constants/Colors";
import { STRINGS } from "../../Constants/Strings";
import withTheme from "../HOC";
import { customDialogInputProps } from "./types";

const CustomDialogInput = ({
  input = "",
  isVisible,
  onCancel,
  onSubmit,
}: customDialogInputProps) => {
  const [inputValue, setInputValue] = useState(input);

  return (
    <Dialog.Container visible={isVisible}>
      <Dialog.Title style={{ color: COLORS.BLACK }}>
        {STRINGS.ENTER_LINK_URL}
      </Dialog.Title>
      <Dialog.Input
        placeholder={STRINGS.ENTER_URL}
        placeholderTextColor={COLORS.BLACK}
        style={{ color: COLORS.BLACK }}
        onChangeText={setInputValue}
        value={inputValue}
      />
      <Dialog.Button label="Cancel" onPress={onCancel} />
      <Dialog.Button label="Save" onPress={() => {onSubmit(inputValue);onCancel();}} />
    </Dialog.Container>
  );
};

export default withTheme(CustomDialogInput);
