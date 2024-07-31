import NetInfo from "@react-native-community/netinfo";
import { default as auth } from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import withTheme from "../../Components/HOC";
import { SCREEN_CONSTANTS } from "../../Constants";
import { useFirebaseListener } from "../../Hooks/firebase";
import ForgotPassword from "../../Screens/ForgotPassword";
import Label from "../../Screens/Labels";
import LogIn from "../../Screens/LogIn";
import Enter from "../../Screens/MainScreen";
import Note from "../../Screens/Note";
import SignUp from "../../Screens/SignUp";
import Splash from "../../Screens/SplashScreen";
import { useAppDispatch } from "../../Store";
import { setConnectionStatus } from "../../Store/Image";
import { loadThemeFromStorage } from "../../Store/Theme";
import { RootStackParamList } from "../../Types/navigation";
import HomeNavigation from "../HomeNavigation";
import { authNavigationProps, commonState, imageState } from "./types";

function AuthNavigation({ theme }: authNavigationProps) {
  const isConnected = useSelector(
    (state: imageState) => state.image.isConnected
  );
  const isLoggedIn = useSelector(
    (state: commonState) => state.common.isLogedIn
  );
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadThemeFromStorage());
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setConnectionStatus(state.isConnected));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
  const user = auth().currentUser?.uid;
  useFirebaseListener(user?? '');
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
