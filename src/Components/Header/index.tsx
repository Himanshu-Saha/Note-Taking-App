import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LIGHT_THEME_COLOR } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";
import withTheme from "../HOC";
import Icon from "../Icon";
import { styles } from "./style";
import { headerTypes } from "./types";

function Header({
  onChangeText,
  notesData,
  handleSetInittialOnBlur,
  headerText,
  theme,
  showDelete,
  handleDelete,
}: headerTypes) {
  const navigation = useNavigation();
  const [isFocussed, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const THEME = theme;

  const label = () => {
    if (!headerText) return headerText;
    if (headerText.length > 12) return headerText.slice(0, 10) + "...";
    else return headerText;
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <View style={styles.leftHeader}>
          {ICONS.BACK(25, 25, "none")}
          <Text style={[styles.text]}>Back</Text>
        </View>
      </Pressable>
      {!isFocussed && (
        <View>
          <Text
            style={[styles.headerText, { color: THEME?.TEXT4 }]}
            onPress={() => Alert.alert(headerText)}
          >
            {label()}
          </Text>
        </View>
      )}
      <View
        style={[styles.rightHeader, isFocussed && styles.rightHeaderFocused]}
      >
        {handleSetInittialOnBlur && (
          <TouchableOpacity style={styles.searchContainer}>
            {!isFocussed && (
              <Icon
                icon={ICONS.SEARCH}
                height={25}
                width={25}
                color="none"
                // style={styles.iconContainer}
              />
            )}
            {onChangeText && notesData && (
              <TextInput
                style={[styles.text]}
                placeholder="Search"
                value={value}
                placeholderTextColor={LIGHT_THEME_COLOR.HEADER}
                onChangeText={(text) => {
                  onChangeText(text);
                  setValue(text);
                }}
                onFocus={() => {
                  setIsFocused(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  handleSetInittialOnBlur();
                  setValue("");
                }}
              />
            )}
          </TouchableOpacity>
        )}
        {showDelete && (
          <View style={{ alignSelf: "flex-end", paddingRight: 10 }}>
            <Icon
              icon={ICONS.DELETE}
              width={22}
              height={22}
              action={handleDelete}
              color={theme.DELETE}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default withTheme(Header);
