import { StyleSheet } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { LIGHT_THEME_COLOR } from "../../Constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_THEME_COLOR.BACKGROUND,
  },
  searchContainer: {
    // maxWidth:RFPercentage(50),
    // width:"50%",
    // width:100
    flex:1,
    paddingTop: heightPercentageToDP("0%"),
    justifyContent: 'center', // Centers vertically within the container
    alignItems: 'center', // Centers horizontally within the container
  },
  subContainer: {
    paddingBottom: heightPercentageToDP("10%"),
    flex:1,
  },
  addNotes: {
    position: "absolute",
    bottom: 40,
    left: "25%",
  },
  customButton: {
    width: 200,
  },
  noReminder: {
    flex: 1, // Ensure it takes up all available space
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
  },
  noReminderText: {
    opacity: 0.5,
    textAlign: "center",
    fontFamily: "Nunito",
    fontSize: heightPercentageToDP("2.5"),
    fontWeight: "bold",
  },
});
