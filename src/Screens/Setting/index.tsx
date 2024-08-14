import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRealm } from "@realm/react";
import React from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ToggleSwitch from "toggle-switch-react-native";
import withTheme from "../../Components/HOC";
import Search from "../../Components/Header";
import { SCREEN_CONSTANTS } from "../../Constants";
import { DEVICE_THEME } from "../../Constants/Colors";
import { STRINGS } from "../../Constants/Strings";
import { RootState } from "../../Store";
import { updateLogIn, updateUser } from "../../Store/Common";
import { toggleTheme } from "../../Store/Theme";
import { styles } from "./style";
import { SettingProps } from "./types";

function Setting({ navigation, theme }: SettingProps) {
  const dispatch = useDispatch();

  const isThemeOn = useSelector((state: RootState) => state.theme.theme);
  const user = useSelector((state: RootState) => state.common.user);
  const THEME = theme;
  const realm = useRealm();
  const signOut = async () => {
    try {
      if (user?.providerId !== "google.com") {
        await auth().signOut();
        dispatch(updateLogIn(false));
        dispatch(updateUser(null));
        await AsyncStorage.clear();
        realm.write(() => realm.deleteAll());
        navigation.navigate(SCREEN_CONSTANTS.Enter);
      } else {
        try {
          await GoogleSignin.signOut();
          dispatch(updateLogIn(false));
          dispatch(updateUser(null));
          await AsyncStorage.clear();
          realm.write(() => realm.deleteAll());
          navigation.navigate(SCREEN_CONSTANTS.Enter);
        } catch (error) {
          console.error(error);
        }
      }
      // console.log("data removed to storage logout");
    } catch (e) {
      console.log(e);
    }
  };

  const SignOutAlert = () => {
    Alert.alert(STRINGS.SIGN_OUT, STRINGS.ARE_YOU_SURE, [
      {
        text: STRINGS.CANCEL,
      },
      {
        text: STRINGS.OK,
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: THEME.BACKGROUND,
        },
      ]}
    >
      <View>
        <Search headerText={STRINGS.SETTINGS} />
      </View>
      <View style={styles.subContainer}>
        <View
          style={[
            styles.box1,
            {
              backgroundColor: THEME.SETTING_BOX,
            },
          ]}
        >
          <View style={styles.view}>
            <View>
              <Text
                style={[
                  styles.text,
                  {
                    color: THEME.TEXT1,
                  },
                ]}
              >
                {STRINGS.SETTING.CHANGE_PROFILE}
              </Text>
            </View>
          </View>
          <View style={styles.view}>
            <View>
              <Text
                style={[
                  styles.text,
                  {
                    color: THEME.TEXT1,
                  },
                ]}
              >
                {STRINGS.THEME}
              </Text>
            </View>
            <View>
              <ToggleSwitch
                isOn={isThemeOn === DEVICE_THEME.DARK}
                onColor="black"
                circleColor={THEME.BACKGROUND1}
                offColor="white"
                labelStyle={{ color: "black", fontWeight: "900" }}
                size="medium"
                onToggle={() => dispatch(toggleTheme())}
              />
            </View>
          </View>
          <View style={styles.view}>
            <View>
              <Text
                style={[
                  styles.text,
                  {
                    color: THEME.TEXT1,
                  },
                ]}
              >
                {STRINGS.SETTING.CHANGE_PASSWORD}
              </Text>
            </View>
          </View>
        </View>
        {/* Other settings items */}
        <TouchableOpacity onPress={SignOutAlert}>
          <View
            style={[
              styles.box1,
              styles.box2,
              {
                backgroundColor: THEME.SETTING_BOX,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: THEME.TEXT1,
                },
                // styles.textBold,
              ]}
            >
              {STRINGS.SIGN_OUT}
            </Text>
            {/* </View> */}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default withTheme(Setting);
