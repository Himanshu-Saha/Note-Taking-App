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
import { STRINGS } from "../../Constants/Strings";
import { useLabelsById } from "../../Hooks/firebase";
import { Note } from "../../RealmDB";
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
          item.data.toLowerCase().match(text) ||
          item.title.toLowerCase().match(text)
        );
      });
      // console.log(filteredData);
      setSearchData(filteredData);
    }
  };
  useEffect(() => {
    // InterstitialAd("ca-app-pub-3940256099942544/1033173712");
  }, []);
  useLabelsById(labelDetails.labelId,realm,setNotesData,isLoading)
  const addNewNote = () => {
    navigation.navigate(SCREEN_CONSTANTS.Note, { labelDetails });
  };
  //  console.log(useQuery(Note),'realm');

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
      <StaggedLabel data={notesData} labelDetails={labelDetails}/>
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
