import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useRealm } from "@realm/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddLabel from "../../Components/AddLabel";
import withTheme from "../../Components/HOC";
import MyTabBar from "../../Components/TabBar";
import { SCREEN_CONSTANTS } from "../../Constants";
import { useFirestoreToRealmSync } from "../../Hooks/firebase";
import { Label } from "../../RealmDB";
import ADD_LABELS from "../../Screens/AddLabels";
import Home from "../../Screens/Home";
import Note from "../../Screens/Note";
import Reminder from "../../Screens/Reminder";
import Setting from "../../Screens/Setting";
import { RootState } from "../../Store";
import { RootTabParamList } from "../../Types/navigation";
import { syncFirestoreToRealm } from "../../Utils";
import { HomeNavigationProps } from "./types";

function HomeNavigation({ theme }: HomeNavigationProps) {
  const [show, setShow] = useState(false);
  const [labelData, setLabelData] = useState<any>();
  const parentNavigation = useNavigation();
  const Tab = createBottomTabNavigator<RootTabParamList>();
  const user = useSelector((state: RootState) => state.common.user);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const isConnected = useSelector(
    (state: RootState) => state.network.isAvailable
  );
  let uid = user?.uid;
  const realm = useRealm();
  useEffect(() => {
    if (!isLoading) {
      const labels = realm.objects<Label>("Label").sorted("timestamp", true);
      const updateLabels = () => {
        setLabelData([...labels]);
      };
      updateLabels();
      labels.addListener(() => updateLabels());
      return () => {
        labels.removeListener(updateLabels);
      };
    }
  }, [realm,isLoading]);
  useEffect(()=>{
    syncFirestoreToRealm(user?.uid, realm)
  },[])
  useFirestoreToRealmSync(uid, realm, isLoading, isConnected);
  return (
    <>
      <Tab.Navigator
        initialRouteName={SCREEN_CONSTANTS.Home}
        tabBar={(props) => (
          <MyTabBar
            {...props}
            parentNavigation={parentNavigation}
            setShow={setShow}
            labelData={labelData}
          />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name={SCREEN_CONSTANTS.Home} component={Home} />
        <Tab.Screen name={SCREEN_CONSTANTS.Extra1} component={ADD_LABELS} />
        <Tab.Screen name={SCREEN_CONSTANTS.Note} component={Note} />
        <Tab.Screen
          name={SCREEN_CONSTANTS.Extra2}
          component={Reminder}
          initialParams={{ parentNavigation }}
        />
        <Tab.Screen name={SCREEN_CONSTANTS.Setting} component={Setting} />
      </Tab.Navigator>
      {show && <AddLabel uid={uid} setShow={setShow} show={show} />}
    </>
  );
}
export default withTheme(HomeNavigation);
