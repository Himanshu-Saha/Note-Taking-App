import { useRealm } from "@realm/react";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CustomButton from "../../Components/Button/customButton";
import withTheme from "../../Components/HOC";
import Search from "../../Components/Header";
import StaggedLabel from "../../Components/Staggered";
import { SCREEN_CONSTANTS } from "../../Constants";
import { REALM, STRINGS } from "../../Constants/Strings";
import { Note } from "../../RealmDB";
import { InterstitialAd } from "../../Shared/Services/NativeModules";
import { RootState } from "../../Store";
import { styles } from "./style";
import { LabelProps, labelNotesDataType } from "./types";

function Label({ navigation, route, theme }: LabelProps) {
  const [searchData, setSearchData] = useState<labelNotesDataType>([]);
  const [notesData, setNotesData] = useState<Note[]>();
  const user = useSelector((state: RootState) => state.common.user);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const realm = useRealm();
  const uid = user?.uid;
  const labelDetails =
    (route.params as { labelDetails?: { labelId: string; labelName: string } })
      ?.labelDetails ?? {};
  const THEME = theme;
  const search = (e: string) => {
    let text = e.toLowerCase();
    if (notesData) {
      let filteredData = notesData.filter((item) => {
        return (
          item.content.toLowerCase().match(text) ||
          item.title.toLowerCase().match(text)
        );
      });
      setSearchData(filteredData);
    }
  };
  useEffect(() => {
    InterstitialAd("ca-app-pub-3940256099942544/1033173712");
  }, []);
  useEffect(() => {
    setSearchData(notesData);
  }, [notesData]);
  // useLabelsById(labelDetails.labelId,realm,setNotesData,isLoading)
  useEffect(() => {
    if (!isLoading) {
      const notes = realm
        .objects<Note>("Note")
        .filtered("label == $0", labelDetails.labelId)
        .filtered("status != $0", REALM.STATUS.DELETE)
        .sorted("timestamp", true);
      const updateLabels = () => {
        setNotesData([...notes]);
      };
      updateLabels();
      notes.addListener(() => updateLabels());
      return () => {
        notes.removeListener(updateLabels);
      };
    }
  }, [realm, isLoading]);

  const addNewNote = () => {
    navigation.navigate(SCREEN_CONSTANTS.Note, { labelDetails });
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
          headerText={labelDetails.labelName}
        />
      </View>
      <StaggedLabel data={notesData} labelDetails={labelDetails} />
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
