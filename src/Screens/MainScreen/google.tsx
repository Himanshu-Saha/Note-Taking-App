import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import { SCREEN_CONSTANTS } from "../../Constants";
import { ICONS } from "../../Constants/Icons";
import { PLATEFORM, STRINGS } from "../../Constants/Strings";
import { updateLogIn, updateUser } from "../../Store/Common";
import {
  RootStackParamList,
  RootStackScreenProps,
} from "../../Types/navigation";
import { signUpUser } from "../../Utils";
import { styles } from "./style";

export default function Google() {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<RootStackScreenProps<keyof RootStackParamList>>();

  GoogleSignin.configure({
    webClientId:
      "963157051833-a1elv0njn1tu58p9fjnfe8277bi2aj6c.apps.googleusercontent.com",
  });

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          userInfo.idToken
        );
        const ans = await auth().signInWithCredential(googleCredential);
        if (ans.additionalUserInfo?.isNewUser) {
          signUpUser(ans.user, navigation);
        } else {
          dispatch(updateUser(ans.user));
          dispatch(updateLogIn(true));
          await AsyncStorage.setItem(
            STRINGS.IS_LOGGED_IN,
            JSON.stringify(true)
          );
          await AsyncStorage.setItem(
            "User",
            JSON.stringify(ans.user)
          );
          navigation.navigate(SCREEN_CONSTANTS.HomeNavigation);
        }
      } else {
        // console.log('User cancelled the login or there was an error');
      }
    } catch (error: any) {
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            // console.log('Operation (eg. sign in) already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // console.log('Play services not available or outdated');
            break;
          default:
          // console.log('Some other error happened', error);
        }
      } else {
        // console.log('An error not related to Google sign-in occurred', error);
      }
    }
  };

  return (
    <View style={styles.google}>
      <TouchableOpacity onPress={_signIn}>
        <View style={styles.googleContainer}>
          {ICONS.GOOGLE(
            Platform.OS == PLATEFORM.IOS
              ? heightPercentageToDP("2%")
              : heightPercentageToDP("2.5%"),
            Platform.OS == PLATEFORM.IOS
              ? heightPercentageToDP("2%")
              : heightPercentageToDP("2.5%"),
            "none"
          )}
          <Text style={styles.text}>{STRINGS.GOOGLE_SIGN_IN}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
