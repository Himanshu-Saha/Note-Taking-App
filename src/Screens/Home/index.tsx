import { useFocusEffect } from "@react-navigation/native";
import { useRealm } from "@realm/react";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ImageRequireSource,
  SafeAreaView,
  StyleProp,
  Text,
  View,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import FastImage, { ImageStyle, ResizeMode } from "react-native-fast-image";
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
import { REALM, STRINGS } from "../../Constants/Strings";
import { Label } from "../../RealmDB";
import { RootState } from "../../Store";
import { colorSchemeState } from "../MainScreen/type";
import { styles } from "./style";
import { HomeProps } from "./types";
function Home({ theme }: HomeProps) {
  const [usedSpace, setUsedSpace] = useState(0);
  const [freeSpace, setFreeSpace] = useState(0);
  const realm = useRealm();
  const [label, setLabel] = useState<Label[]>();
  const colorScheme = useSelector(
    (state: colorSchemeState) => state.theme.theme
  );
  const THEME = theme;
  const user = useSelector((state: RootState) => state.common.user);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const isNetworkAvalible = useSelector(
    (state: RootState) => state.network.isAvailable
  );
  const uid = user?.uid;
  // const defaultImage = require(IMAGES.DEFAULTUSER);
  // const photoURL = user ? user.photoURL : defaultImage;
  // const userPhoto = photoURL ?? defaultImage
// console.log(defaultImage,'asdfadsfdsfasdfds',typeof defaultImage);
// console.log(user.photoURL);

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
  }, [realm, isLoading, setLabel]);
  useFocusEffect(
    useCallback(() => {
      fetchStorageInfo();
    }, [fetchStorageInfo])
  );
  const bytesToGB = (bytes: number) =>
    (bytes / (1024 * 1024 * 1024)).toFixed(2);

  if (!user) {
    return null;
  }
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: THEME.BACKGROUND }]}
    >
      <View style={styles.subcontainer}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcome, { color: THEME.TEXT3 }]}>
              {"Welcome" + ", " + user.displayName + "!"}
            </Text>
            <Text style={[styles.NoteTaking, { color: THEME.TEXT1 }]}>
              {STRINGS.NOTE}
            </Text>
          </View>
          <View style={styles.innerHeader}>
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor={THEME.BACKGROUND}
              style={{
                borderRadius: 50,
                height: heightPercentageToDP("6.8%"),
                width: heightPercentageToDP("6.8%"),
              }}
              source={user.photoURL?{uri:user.photoURL}:require('../../Assets/Images/defaultUser.png') }
              renderImageComponent={({ source, resizeMode, style }) => (
                <FastImage
                  style={style as StyleProp<ImageStyle>}
                  source={source as ImageRequireSource}
                  resizeMode={resizeMode as ResizeMode}
                />
              )}
            />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={colorScheme === "light" ? IMAGES.HOME : IMAGES.HOME_DARK}
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
                    {bytesToGB(usedSpace)} GB of {bytesToGB(freeSpace)} GB Used
                  </Text>
                </View>
              </View>
            </ImageBackground>
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
                      colorScheme === "light" ? ICONS.OTHERS : ICONS.INTEL_BLACK
                    }
                    labelName={item.label}
                    labelId={item._id}
                    numberOfNotes={item.count}
                  />
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default withTheme(Home);
