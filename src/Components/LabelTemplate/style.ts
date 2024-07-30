import { Platform, StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    sub: {
      paddingHorizontal: widthPercentageToDP('1.1%'),
      paddingTop: heightPercentageToDP('1.1%'),
      paddingBottom: heightPercentageToDP('1.4%'),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
      }),
    },
    container: {
      height: heightPercentageToDP('20%'),
      width: widthPercentageToDP('44.5%'),
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      paddingTop: heightPercentageToDP('1.2%'),
      fontWeight: 'bold',
    },
    inner: {
      paddingLeft: widthPercentageToDP('7%'),
    },
  });