// CustomDialogInput.js
import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { STRINGS } from "../../Constants/Strings";
import withTheme from "../HOC";
import { customDialogInputProps } from "./types";

const CustomDialogInput = ({
  description,
  placeholder,
  input = "",
  isVisible,
  onCancel,
  onSubmit,
  theme,
}: customDialogInputProps) => {
  const [inputValue, setInputValue] = useState(input);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.BACKGROUND }]}
        >
          <Text style={[styles.title, { color: theme.TEXT1 }]}>
            {description}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.TEXT1 }]}
            placeholder={placeholder}
            placeholderTextColor={theme.TEXT1}
            maxLength={description === STRINGS.ENTER_LINK_URL ? 40 : 20}
            onChangeText={setInputValue}
            value={inputValue}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={STRINGS.CANCEL}
              onPress={() => {
                setInputValue("");
                onCancel();
              }}
            />
            <Button
              title={STRINGS.SUBMIT}
              onPress={() => {
                onSubmit(inputValue);
                setInputValue("");
                onCancel();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
    // <Dialog.Container visible={isVisible}>
    //   <Dialog.Title style={{ color: COLORS.BLACK }}>
    //     {STRINGS.ENTER_LINK_URL}
    //   </Dialog.Title>
    //   <Dialog.Input
    //     placeholder={STRINGS.ENTER_URL}
    //     placeholderTextColor={COLORS.BLACK}
    //     style={{ color: COLORS.BLACK }}
    //     onChangeText={setInputValue}
    //     value={inputValue}
    //   />
    //   <Dialog.Button label="Cancel" onPress={onCancel} />
    //   <Dialog.Button label="Save" onPress={() => {onSubmit(inputValue);onCancel();}} />
    // </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default withTheme(CustomDialogInput);
