import { default as auth } from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  SafeAreaView,
  Text,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import ImageModal from "react-native-image-modal";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-virtualized-view";
import { useSelector } from "react-redux";
import withTheme from "../../Components/HOC";
import LabelTemplate from "../../Components/LabelTemplate/LabelTemplate";
import { ICONS } from "../../Constants/Icons";
import { IMAGES } from "../../Constants/Images";
import { STRINGS } from "../../Constants/Strings";
import { useUpdateLabel } from "../../Hooks/firebase";
import { fetchLabels } from "../../Utils";
import { colorSchemeState } from "../MainScreen/type";
import { styles } from "./style";
import { HomeProps, newDataType } from "./types";
// import { AdBannerComponent } from "../../Shared/Services/NativeModules";

function Home({ theme }: HomeProps) {
  const [usedSpace, setUsedSpace] = useState(0);
  const [freeSpace, setFreeSpace] = useState(0);
  const [label, setLabel] = useState<newDataType | null>();
  const colorScheme = useSelector(
    (state: colorSchemeState) => state.theme.theme
  );
  const THEME = theme;
  const user = auth().currentUser;
  const defaultImage = IMAGES.DEFAULTUSER;
  const photoURL = user?.photoURL
    ? { uri: { uri: user.photoURL } }
    : { uri: defaultImage };
  useEffect(() => {
    if(user?.uid)
    fetchLabels(user?.uid);
  }, []);
  if(user?.uid)
  useUpdateLabel(user?.uid,setLabel)
  const fetchStorageInfo = useCallback(async () => {
    try {
      const freeDiskStorage = await DeviceInfo.getTotalDiskCapacity();
      const usedMemory = await DeviceInfo.getUsedMemory();
      setFreeSpace(freeDiskStorage);
      setUsedSpace(usedMemory);
    } catch (error) {
      // console.error("Error fetching storage info:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStorageInfo();
    }, [fetchStorageInfo])
  );

  const bytesToGB = (bytes: number) =>
    (bytes / (1024 * 1024 * 1024)).toFixed(2);
  if (user) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: THEME.BACKGROUND }]}
      >
        <View style={styles.subcontainer}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.welcome, { color: THEME.TEXT3 }]}>
                {"Welcome" + ", " + user?.displayName + "!"}
              </Text>
              <Text style={[styles.NoteTaking, { color: THEME.TEXT1 }]}>
                {STRINGS.NOTE}
              </Text>
            </View>
            <View style={styles.innerHeader}>
              <ImageModal
                // modalImageStyle={{height:50,width:50}}
                resizeMode="contain"
                imageBackgroundColor={THEME.BACKGROUND}
                style={{
                  borderRadius: 50,
                  height: heightPercentageToDP("6.8%"),
                  width: heightPercentageToDP("6.8%"),
                }}
                source={photoURL.uri}
              />
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <ImageBackground
                source={
                  colorScheme === "light" ? IMAGES.HOME : IMAGES.HOME_DARK
                }
                // resizeMode="cover"
                style={styles.image}
              >
                <View style={styles.imageInner}>
                  {colorScheme === "light"
                    ? ICONS.PIECHART(
                        heightPercentageToDP("8.2%"),
                        heightPercentageToDP("8.2%"),
                        "none"
                      )
                    : ICONS.PIECHART_BLACK(
                        heightPercentageToDP("8.2%"),
                        heightPercentageToDP("8.2%"),
                        "none"
                      )}
                  <View style={{ paddingLeft: widthPercentageToDP("7%") }}>
                    <Text style={[styles.text]}>{STRINGS.AVAILABLE_SPACE}</Text>
                    <Text style={[styles.size, { color: THEME.HOMESIZE }]}>
                      {bytesToGB(usedSpace)} GB of {bytesToGB(freeSpace)} GB
                      Used
                    </Text>
                  </View>
                </View>
              </ImageBackground>
              {/* <NewModuleButton /> */}
            </View>

            {!label && <ActivityIndicator size="large" />}
            {label && (
              <View style={styles.labels}>
                <FlatList
                  data={label}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  renderItem={({ item }) => (
                    <LabelTemplate
                      icon={
                        colorScheme === "light"
                          ? ICONS.OTHERS
                          : ICONS.INTEL_BLACK
                      }
                      labelName={item.labelName}
                      labelId = {item.labelId}
                      numberOfNotes={item.count}
                      uid={user.uid}
                      // theme={THEME}
                    />
                  )}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  } else {
    return <></>;
  }
}
export default withTheme(Home);
