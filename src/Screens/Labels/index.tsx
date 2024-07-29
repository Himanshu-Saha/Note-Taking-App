import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../Components/Button/customButton";
import withTheme from "../../Components/HOC";
import Search from "../../Components/Header";
import StaggedLabel from "../../Components/Staggered";
import { SCREEN_CONSTANTS } from "../../Constants";
import { STRINGS, STRINGS_FIREBASE } from "../../Constants/Strings";
import {
  InterstitialAd
} from "../../Shared/Services/NativeModules";
import { styles } from "./style";
import { LabelProps, labelNotesDataType } from "./types";
import { fetchNotesWithLabel } from "../../Utils";
import { useFetchUpdatedLabelData } from "../../Hooks/firebase";

function Label({ navigation, route, theme }: LabelProps) {
  const [searchData, setSearchData] = useState<labelNotesDataType>([]);
  const [notesData, setNotesData] = useState<labelNotesDataType>([]);

  const uid = route.params?.uid ?? "";
  const labelId = route.params?.labelId ?? "";
  const labelName = route.params?.labelName ?? "";
  const THEME = theme;
  const note = {
    uid,
    labelId,
    labelName,
  };

  const search = (e: string) => {
    let text = e.toLowerCase();
    if (notesData) {
      let filteredData = notesData.filter((item) => {
        return (
          item.data.toLowerCase().match(text) ||
          item.title.toLowerCase().match(text)
        );
      });
      // console.log(filteredData);
      setSearchData(filteredData);
    }
  };

  useEffect(() => {
    fetchNotesWithLabel(labelId, labelName, uid, setNotesData);
  }, [uid]);
  useFetchUpdatedLabelData(labelId, labelName, uid, setNotesData, setSearchData)
  useEffect(() => {
    // InterstitialAd("ca-app-pub-3940256099942544/1033173712");
  }, []);

  const addNewNote = () => {
    navigation.navigate(SCREEN_CONSTANTS.Note, { note });
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: THEME.BACKGROUND }]}
    >
      <View>
        <Search
          onChangeText={search}
          handleSetInittialOnBlur={() => setSearchData(notesData)}
          notesData={notesData}
          headerText={labelName}
        />
      </View>
      <StaggedLabel data={notesData} />
      <View style={styles.addNotes}>
        <CustomButton
          text={STRINGS.ADD_NEW_NOTES}
          style={[styles.customButton]}
          onPress={addNewNote}
        />
      </View>
    </SafeAreaView>
  );
}

export default withTheme(Label);
