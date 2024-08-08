import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRealm } from "@realm/react";
import { useEffect } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import withTheme from "../../Components/HOC";
import { SCREEN_CONSTANTS } from "../../Constants";
import { useNetworkAvailable } from "../../Hooks/network";
import ForgotPassword from "../../Screens/ForgotPassword";
import Label from "../../Screens/Labels";
import LogIn from "../../Screens/LogIn";
import Enter from "../../Screens/MainScreen";
import Note from "../../Screens/Note";
import SignUp from "../../Screens/SignUp";
import Splash from "../../Screens/SplashScreen";
import { RootState, useAppDispatch } from "../../Store";
import { updateLogIn, updateUser } from "../../Store/Common";
import { setLoading } from "../../Store/Loader";
import { RootStackParamList } from "../../Types/navigation";
import { syncFirestoreToRealm, syncRealmToFirestore } from "../../Utils";
import HomeNavigation from "../HomeNavigation";
import { authNavigationProps } from "./types";

function AuthNavigation({ theme }: authNavigationProps) {
  const realm = useRealm();
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.common.isLogedIn);
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const user = useSelector((state: RootState) => state.common.user);
  const isConnected = useSelector(
    (state: RootState) => state.network.isAvailable
  );

  useNetworkAvailable(dispatch);

  // fetch user credentail(if exist) from storage
  useEffect(() => {
    AsyncStorage.getItem("User").then((user) => {
      if (user) {
        const data = JSON.parse(user);
        dispatch(updateUser(data));
      } else {
        dispatch(updateUser(null));
      }
    });
    AsyncStorage.getItem("isLogedIn").then((flag) => {
      if (flag) {
        JSON.parse(flag);
        dispatch(updateLogIn(flag));
      } else dispatch(updateLogIn(false));
    });
  }, []);

  // sync data to firestore based on network
  useEffect(() => {
    if (isLoggedIn && !user?.uid) {
      console.log("user?.uid missing auth page");
      dispatch(updateLogIn(false));
    } else if (isLoggedIn && isConnected && user?.uid) {
      dispatch(setLoading(true));
      syncRealmToFirestore(user?.uid, realm)
        .then(() => {
          syncFirestoreToRealm(user?.uid, realm)
            .then(() => {
              console.log("synced Firestore To Realm successfully");
              dispatch(setLoading(false));
            })
            .catch((e) => {
              console.log(e, "Error1: syncFirestoreToRealm");
              dispatch(setLoading(false));
            });
        })
        .catch((e) => {
          console.log(e, "Error2: syncFirestoreToRealm");
          dispatch(setLoading(false));
        });
    } else console.log("not connected to any network");
  }, [isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREEN_CONSTANTS.Splash}
        screenOptions={{
          headerStyle: { backgroundColor: theme.BACKGROUND },
          headerTitleAlign: "center",
          headerTintColor: "rgb(107, 78, 253)",
          headerTitleStyle: {
            fontWeight: "bold",
            color: theme.TEXT1,
            fontSize: heightPercentageToDP("3%"),
          },
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name={SCREEN_CONSTANTS.Splash}
              component={Splash}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREEN_CONSTANTS.Enter}
              component={Enter}
              options={{ headerShown: false }}
            />
            <Stack.Screen name={SCREEN_CONSTANTS.Login} component={LogIn} />
            <Stack.Screen
              name={SCREEN_CONSTANTS.SignUp}
              component={SignUp}
              options={{ headerTitle: "Create Account" }}
            />
            <Stack.Screen
              name={SCREEN_CONSTANTS.ForgotPassword}
              component={ForgotPassword}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={SCREEN_CONSTANTS.HomeNavigation}
              component={HomeNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREEN_CONSTANTS.Note}
              component={Note}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREEN_CONSTANTS.Label}
              component={Label}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default withTheme(AuthNavigation);
