// src/Screens/SplashScreen/index.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import Fade from "react-native-fade";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import withTheme, { themeType } from "../../Components/HOC";
import { SCREEN_CONSTANTS } from "../../Constants";
import { ICONS } from "../../Constants/Icons";
import { STRINGS } from "../../Constants/Strings";
// import { updateLogIn } from "../../Store/Common";
import { getFromAsyncStorage } from "../../Store/Image";
import { styles } from "./style";
import { SplashProps } from "./types";
import { updateLogIn } from "../../Store/Common";
import { RootState } from "../../Store";

function Splash({ theme, navigation }: SplashProps) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const THEME = theme;
  const isLoggedIn = useSelector((state: RootState) => state.common.isLogedIn);

  // useEffect(() => {
  //   setVisible(true);
  //   async function fetchAllData() {
  //     try {
  //       const keys = await AsyncStorage.getAllKeys();
  //       const fetchedData = await AsyncStorage.multiGet(keys);
  //       setTimeout(() => {
  //         if (fetchedData.length) {
  //           const isLoggedInData = fetchedData.find(
  //             ([key]) => key === STRINGS.IS_LOGGED_IN
  //           );
  //           if (isLoggedInData && isLoggedInData[1]) {
  //             try {
  //               const isLoggedIn = JSON.parse(isLoggedInData[1]);
  //               if (isLoggedIn) {
  //                 dispatch(updateLogIn(true));
  //                 navigation.dispatch(
  //                   CommonActions.reset({
  //                     index: 0,
  //                     routes: [{ name: SCREEN_CONSTANTS.HomeNavigation }],
  //                   })
  //                 );
  //               } else {
  //                 dispatch(updateLogIn(false));
  //                 navigation.dispatch(
  //                   CommonActions.reset({
  //                     index: 0,
  //                     routes: [{ name: SCREEN_CONSTANTS.Enter }],
  //                   })
  //                 );
  //               }
  //             } catch (e) {
  //               // console.error("Error parsing isLoggedInData:", e);
  //               dispatch(updateLogIn(false));
  //               navigation.dispatch(
  //                 CommonActions.reset({
  //                   index: 0,
  //                   routes: [{ name: SCREEN_CONSTANTS.Enter }],
  //                 })
  //               );
  //             }
  //           } else {
  //             navigation.dispatch(
  //               CommonActions.reset({
  //                 index: 0,
  //                 routes: [{ name: SCREEN_CONSTANTS.Enter }],
  //               })
  //             );
  //           }
  //         } else {
  //           navigation.dispatch(
  //             CommonActions.reset({
  //               index: 0,
  //               routes: [{ name: SCREEN_CONSTANTS.Enter }],
  //             })
  //           );
  //         }
  //       }, 100);
  //     } catch (e) {
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [{ name: SCREEN_CONSTANTS.Enter }],
  //         })
  //       );
  //     }
  //   }
  //   fetchAllData();
  // }, [dispatch, navigation]);
  useEffect(()=>{
    setTimeout(()=>{
      if(isLoggedIn)navigation.navigate(SCREEN_CONSTANTS.HomeNavigation)
        else navigation.navigate(SCREEN_CONSTANTS.Enter)
    },1000)
  },[])

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: THEME.BACKGROUND }]}
    >
      <View style={styles.view}>
        <Fade visible={visible} direction="up" duration={200}>
          <View style={styles.icon}>
            {ICONS.BOOK(
              heightPercentageToDP("14%"),
              heightPercentageToDP("14%"),
              "none"
            )}
          </View>
          <View style={styles.viewText}>
            <Text style={styles.text1}>{STRINGS.NOTE_TAKING_APP.PART1}</Text>
            <Text style={[styles.text2, { color: THEME.TEXT1 }]}>
              {STRINGS.NOTE_TAKING_APP.PART2}
            </Text>
          </View>
        </Fade>
        <ActivityIndicator style={styles.indicator} size={"large"} />
      </View>
    </SafeAreaView>
  );
}

export default withTheme(Splash);
