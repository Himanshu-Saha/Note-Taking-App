import { default as auth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AddLabel from '../../Components/AddLabel';
import withTheme from '../../Components/HOC';
import MyTabBar from '../../Components/TabBar';
import { SCREEN_CONSTANTS } from '../../Constants';
import { STRINGS, STRINGS_FIREBASE } from '../../Constants/Strings';
import ADD_LABELS from '../../Screens/AddLabels';
import Home from '../../Screens/Home';
import Note from '../../Screens/Note';
import Extar2 from '../../Screens/Reminder';
import Setting from '../../Screens/Setting';
import { RootTabParamList } from '../../Types/navigation';
import { HomeNavigationProps } from './types';

 function HomeNavigation({theme}:HomeNavigationProps) {
   const [show, setShow] = useState(false);
   const [labelData, setLabelData] = useState<any>();
  const parentNavigation = useNavigation();
  const Tab = createBottomTabNavigator<RootTabParamList>();
  const user = auth().currentUser;
  let uid = user?.uid;
  useEffect(() => {
    const fetchLabelData = async () => {
      try {
        const labelData =  await firestore()
          .collection(STRINGS.FIREBASE.USER)
          .doc(uid)
          .collection(STRINGS.FIREBASE.LABELS)
          .orderBy(STRINGS_FIREBASE.TIME_STAMP, STRINGS_FIREBASE.ORDER)
          .get()
          // console.log(labelData.docs,13);
        setLabelData(labelData)
      } catch (e) {
      }
    };
    fetchLabelData();
    const unsubscribe = firestore()
    .collection(STRINGS.FIREBASE.USER)
    .doc(uid)
    .collection(STRINGS.FIREBASE.LABELS)
    .orderBy(STRINGS_FIREBASE.TIME_STAMP, STRINGS_FIREBASE.ORDER)
    .onSnapshot(querySnapshot => {
      setLabelData(querySnapshot)
    });
  return () => unsubscribe();
  }, [uid]);
  return (
    <>
      <Tab.Navigator
        initialRouteName={SCREEN_CONSTANTS.Home}
        tabBar={props => <MyTabBar {...props} parentNavigation={parentNavigation} setShow={setShow} labelData={labelData}/>}
        screenOptions={{headerShown: false}}>
        <Tab.Screen name={SCREEN_CONSTANTS.Home} component={Home}/>
        <Tab.Screen name={SCREEN_CONSTANTS.Extra1} component={ADD_LABELS}/>
        <Tab.Screen name={SCREEN_CONSTANTS.Note} component={Note}/>
        <Tab.Screen
          name={SCREEN_CONSTANTS.Extra2}
          component={Extar2}
          initialParams={{parentNavigation}}
        />
        <Tab.Screen name={SCREEN_CONSTANTS.Setting} component={Setting}/>
      </Tab.Navigator>
      {show && <AddLabel uid={uid} setShow={setShow} show={show} />}
    </>
  );
}
export default withTheme(HomeNavigation)
