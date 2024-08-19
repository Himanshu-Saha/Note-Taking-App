import React, { useEffect, useRef } from 'react';
import { Alert, Text, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CustomButton from '../../Components/Button/customButton';
import withTheme from '../../Components/HOC';
import CustomText from '../../Components/Text';
import { ICONS } from '../../Constants/Icons';
import { STRINGS } from '../../Constants/Strings';
import { SCREEN_CONSTANTS } from '../../Constants/index';
import { RootState } from '../../Store';
import Google from './google';
import { styles } from './style';
import { EnterProps } from './type';

function Enter({ navigation, theme }: EnterProps) {
  const isConnected = useSelector((state: RootState) => state.network.isAvailable)
  const THEME = theme
  const networkStatus = useRef<boolean>(false);
  useEffect(() => {
    networkStatus.current = isConnected;
    checkConnection();
  }, [isConnected]);
  const onPress = () => {
    navigation.navigate(SCREEN_CONSTANTS.SignUp);
  };
  const logIn = () => {
    navigation.navigate(SCREEN_CONSTANTS.Login);
  };
  const checkConnection = () => {
    if (!networkStatus.current) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => {
              checkConnection();
            },
          },
        ]
      );
    }
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.BACKGROUND }]}>
      <View style={styles.subContainer}>
        <View style={styles.viewText}>
          <Text style={[styles.text1, styles.font]}>{STRINGS.NOTE_TAKING_APP.PART1}</Text>
          <Text style={[styles.text2, styles.font, { color: THEME.TEXT1 }]}>{STRINGS.NOTE_TAKING_APP.PART2}</Text>
        </View>
        <View style={styles.svg}>
          {ICONS.DAIRY(widthPercentageToDP('60'), heightPercentageToDP('25'),)}
        </View>
        <CustomText
          text={STRINGS.SAVE_SHARE_NOTES}
          styles={[styles.textSave, styles.font, { color: THEME.TEXT1 }]}
        />
        <CustomButton text={STRINGS.CREATE_ACCOUNT} onPress={onPress} />
        <Google></Google>
        <View style={styles.footer}>
          <CustomText text={STRINGS.HAVE_ACCOUNT} styles={[styles.simpleText, { color: THEME.TEXT1 }]} />
          <Text onPress={logIn} style={[styles.simpleText, styles.colorText]}>
            {'  ' + STRINGS.LOG_IN}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default withTheme(Enter)