import { Platform, StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: heightPercentageToDP("1.5%"),
    paddingVertical:
      Platform.OS == "ios"
        ? heightPercentageToDP("1.8%")
        : heightPercentageToDP("1%"),
    paddingHorizontal: widthPercentageToDP("2%"),
    borderRadius: 10,
  },
  error: {
    color: "red",
    fontSize: heightPercentageToDP("1.5%"),
    fontStyle: "italic",
    width:widthPercentageToDP('85%')
  },
  label: {
    color: "rgb(114,119,122)",
    paddingLeft: Platform.OS === "ios" ? 0 : widthPercentageToDP("0.8%"),
  },
  eye: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    alignContent: "center",
    justifyContent: "center",
  },
});
