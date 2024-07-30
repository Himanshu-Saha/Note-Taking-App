import { default as auth } from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import withTheme from "../../Components/HOC";
import Search from "../../Components/Header";
import ListTemplate from "../../Components/ListTemplate/listTemplate";
import { useUpdateLabel } from "../../Hooks/firebase";
import { fetchLabels } from "../../Utils";
import { styles } from "./style";
import { addLabelProp } from "./types";

function ADD_LABELS({ theme }: addLabelProp) {
  const [notesData, setNotesData] = useState();
  const user = auth().currentUser;
  const THEME = theme;
  let uid = user?.uid;
  useEffect(() => {
    if (uid) fetchLabels(uid).then((data) => setNotesData(data));
  }, []);
  useUpdateLabel(uid, setNotesData);
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: THEME.BACKGROUND }]}
    >
      <View style={styles.subContainer}>
        <View>
          <Search
            // onChangeText={search}
            // notesData={notesData}
            headerText={"Edit Labels"}
          />
        </View>
        <View style={styles.labelContainer}>
          <FlatList
            data={notesData}
            style={styles.list}
            keyExtractor={(item) => item.labelId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ListTemplate note={item} label={true} uid={uid}/>}
          ></FlatList>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default withTheme(ADD_LABELS);
