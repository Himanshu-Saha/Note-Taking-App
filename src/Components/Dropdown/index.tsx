import React, { useState } from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { heightPercentageToDP } from "react-native-responsive-screen";
import withTheme from "../HOC";
import { styles } from "./style";
import { dropdownComponentProps } from "./types";

const DropdownComponent = ({
  data,
  value,
  setValue,
  theme,
}: dropdownComponentProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const THEME = theme;
console.log(value,'1');
// console.log(labelName);

  return (
    <View style={[styles.container, { backgroundColor: THEME?.BACKGROUND }]}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "white" }]}
        placeholderStyle={[styles.placeholderStyle, { color: THEME?.NOTETEXT }]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          { color: THEME?.NOTETEXT },
        ]}
        data={data}
        itemTextStyle={{ color: THEME?.TEXT1 }}
        containerStyle={{ backgroundColor: THEME?.BACKGROUND }}
        activeColor={THEME?.BACKGROUND}
        maxHeight={heightPercentageToDP("30%")}
        labelField="label"
        valueField="_id"
        placeholder={!isFocus ? "Select Label" : "..."}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item._id);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default withTheme(DropdownComponent);
