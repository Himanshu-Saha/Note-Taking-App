import { RealmProvider } from "@realm/react";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { usePushNotification } from "./src/Hooks/pushNotificationcustomHooks";
import AuthNavigation from "./src/Navigation/AuthNavigation";
import { realmConfig } from "./src/RealmDB";
import { initializeAds } from "./src/Shared/Services/NativeModules";
import { store } from "./src/Store";
import Toast from 'react-native-toast-message';

export default function App() {
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        // console.log(error);
      }
    };

    listenToNotifications();
  }, []);
  useEffect(() => {
    initializeAds();
  }, []);
  return (
    <RealmProvider schema={realmConfig.schema}>
      <Provider store={store}>
        <AuthNavigation></AuthNavigation>
      </Provider>
    </RealmProvider>
  );
}
