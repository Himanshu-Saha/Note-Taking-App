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
import { styles } from "./style";
import { LabelProps, labelNotesDataType } from "./types";

function Label({ navigation, route, theme }:LabelProps) {
  const uid = route.params?.note?? '';
  const label = route.params?.text ?? '';
  const THEME = theme;
  const [searchData, setSearchData] = useState<labelNotesDataType >([]);
  const [notesData, setNotesData] = useState<labelNotesDataType>([]);
  const note = {
    uid,
    label,
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
    const fetchData = async () => {
      try {
        const data = await firestore()
          .collection(STRINGS.FIREBASE.USER)
          .doc(uid)
          .collection(STRINGS.FIREBASE.NOTES)
          .where(STRINGS_FIREBASE.LABEL, "==", label)
          .orderBy(STRINGS_FIREBASE.TIME_STAMP, STRINGS_FIREBASE.ORDER)
          .get();

        const newData: labelNotesDataType = []; // Temporary array to accumulate data

        data.forEach((doc) => {
          newData.push({
            title: doc.data().title,
            data: doc.data().content,
            noteId: doc.id,
            id: uid,
            label: label,
            ImageUrl: doc.data().url ?? [],
          });
        });

        setNotesData(newData);
        setSearchData(newData);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch initial data

    // Set up listener for real-time updates
    const unsubscribe = firestore()
      .collection(STRINGS.FIREBASE.USER)
      .doc(uid)
      .collection(STRINGS.FIREBASE.NOTES)

      .where(STRINGS_FIREBASE.LABEL, "==", label)
      .orderBy(STRINGS_FIREBASE.TIME_STAMP, STRINGS_FIREBASE.ORDER)
      .onSnapshot((querySnapshot) => {
        const newData: labelNotesDataType = [];
        querySnapshot.forEach((doc) => {
          newData.push({
            title: doc.data().title,
            data: doc.data().content,
            noteId: doc.id,
            ImageUrl: doc.data().url,
            id: uid,
            label: label,
          });
        });

        setNotesData(newData);
        setSearchData(newData);
      });

    // Stop listening for updates when no longer required
    return () => unsubscribe();
  }, [uid]);

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
          headerText={label}
        />
      </View>
      <StaggedLabel data={searchData} />
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
