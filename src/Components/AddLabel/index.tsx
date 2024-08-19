import { useRealm } from "@realm/react";
import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { STRINGS, TOAST_STRINGS } from "../../Constants/Strings";
import { RootState } from "../../Store";
import { addLabelToRealm, createLabel } from "../../Utils";
import { toastError } from "../../Utils/toast";
import withTheme from "../HOC";
import { addLabelProps } from "./types";

function AddLabel({ uid, show, setShow, theme }: addLabelProps) {
  const [newLabelName, setNewLabelName] = useState<string>();
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const isNetworkAvalible = useSelector(
    (state: RootState) => state.network.isAvailable
  );
  const realm = useRealm();
  const createLabelFromDialog = async () => {
    if (newLabelName) {
      const regex = /^[\s\u00A0\xA0]*$/;
      const labelExist = realm
        .objects("Label")
        .find((item) => item.label === newLabelName);
      if (labelExist) {
        toastError(TOAST_STRINGS.LABEL_EXISTS);
        setShow(false);
        return;
      }
      if (uid && !regex.test(newLabelName)) {
        if (!isLoading && isNetworkAvalible) createLabel(uid, newLabelName);
        else {
          console.log('hek');
          
          addLabelToRealm(newLabelName, realm);
        }
      }
    } else {
      toastError(TOAST_STRINGS.EMPTY_LABEL);
    }
    setShow(false);
  };
  return (
    <Modal
      transparent={true}
      visible={show}
      animationType="slide"
      onRequestClose={() => setShow(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.BACKGROUND }]}
        >
          <Text style={[styles.title, { color: theme.TEXT1 }]}>
            {STRINGS.ADD_LABEL}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.TEXT1 }]}
            placeholder={STRINGS.LABEL_NAME}
            placeholderTextColor={theme.TEXT1}
            maxLength={20}
            onChangeText={(input) => setNewLabelName(input)}
            value={newLabelName}
          />
          <View style={styles.buttonContainer}>
            <Button title={STRINGS.CANCEL} onPress={() => setShow(false)} />
            <Button
              title={STRINGS.SUBMIT}
              onPress={() => createLabelFromDialog()}
              // disabled={newLabelName.trim() === ""}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

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

export default withTheme(AddLabel);
