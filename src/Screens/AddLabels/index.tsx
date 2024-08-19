import { useRealm } from "@realm/react";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { useSelector } from "react-redux";
import withTheme from "../../Components/HOC";
import Search from "../../Components/Header";
import ListTemplate from "../../Components/ListTemplate/listTemplate";
import { REALM } from "../../Constants/Strings";
import { Label } from "../../RealmDB";
import { RootState } from "../../Store";
import { styles } from "./style";
import { addLabelProp } from "./types";

function ADD_LABELS({ theme }: addLabelProp) {
  const user = useSelector((state: RootState) => state.common.user);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const realm = useRealm();
  const uid = user?.uid;
  const [label, setLabel] = useState<Label[]>();
  const THEME = theme;
  useEffect(() => {
    if (!isLoading) {
      const labels = realm
        .objects<Label>("Label")
        .filtered("status != $0", REALM.STATUS.DELETE)
        .sorted("timestamp", true);
      const updateLabels = () => {
        setLabel([...labels]);
      };
      updateLabels();
      labels.addListener(() => updateLabels());
      return () => {
        labels.removeListener(updateLabels);
      };
    }
  }, [realm, isLoading]);
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
            data={label}
            style={styles.list}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.label === "Others") return null;
              return <ListTemplate label={item} isEditLable={true} />;
            }}
          ></FlatList>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default withTheme(ADD_LABELS);
