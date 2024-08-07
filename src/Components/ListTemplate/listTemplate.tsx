import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHTML, { HTMLSource } from "react-native-render-html";
import { useSelector } from "react-redux";
import { SCREEN_CONSTANTS } from "../../Constants";
import { ICONS } from "../../Constants/Icons";
import { RootState } from "../../Store";
import { deleteLabel, updateLabel } from "../../Utils";
import CustomDialogInput from "../DialogInput";
import withTheme from "../HOC";
import Icon from "../Icon";
import { styles } from "./style";
import { listTemplateTypes } from "./types";
function ListTemplate({
  note,
  maxHeight,
  label,
  theme,
  labelDetails,
  isEditLable,
}: listTemplateTypes) {
  const user = useSelector((state: RootState) => state.common.user);
  const navigation = useNavigation();
  const [isDialogInputVisible, setIsDialogInputVisible] = useState(false);
  const source: HTMLSource = {
    html: typeof note?.content === "string" ? note.content : "",
  };
  const { width: contentWidth } = useWindowDimensions();
  const THEME = theme;
  let date;
  // if (typeof note.timestamp === "string") {
  //   date = new Date(note.timestamp);
  // } else if (note.timestamp) {
  //   date = new Date(
  //     note.timestamp.seconds * 1000 + note.timestamp.nanoseconds / 1000000
  //   );
  // } else {
  //   date = "error";
  // }
  // const formattedDate =
  //   date instanceof Date ? date.toLocaleString("en-US") : date;

  const title = () => {
    if (note)
      if (!note.title?.length) return "";
      else {
        if (note.title.length > 15) return note.title.slice(0, 15) + "...";
        else return note.title;
      }
  };
  const handleSubmit = (labelName: string) => {
    if (user && label) updateLabel(user.uid, label._id, labelName);
  };
  return (
    <>
      {isEditLable && (
        <CustomDialogInput
          input={label.label}
          isVisible={isDialogInputVisible}
          onCancel={() => setIsDialogInputVisible(false)}
          onSubmit={handleSubmit}
        />
      )}
      {!label && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(SCREEN_CONSTANTS.Note, { note, labelDetails })
          }
          style={[styles.touch, { maxHeight }]}
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor: THEME.FOOTER,
                // flexDirection: note.timestamp ? "row" : "column",
                flexDirection: "column",
              },
            ]}
          >
            <View>
              {note?.title && (
                <Text
                  style={[
                    styles.title,
                    {
                      color: THEME.TEXT1,
                    },
                  ]}
                >
                  {title()}
                </Text>
              )}
            </View>
            <RenderHTML
              source={source}
              contentWidth={contentWidth}
              defaultTextProps={{
                style: {
                  color: THEME.TEXT1,
                },
              }}
            />
            {/* {note.timestamp && (
              <View>
                <Text
                  style={[
                    styles.title,
                    {
                      color: THEME.TEXT1,
                    },
                  ]}
                >
                  {formattedDate}
                </Text>
              </View>
            )}
            {!note.timestamp && (
              <RenderHTML
                source={source}
                contentWidth={contentWidth}
                defaultTextProps={{
                  style: {
                    color: THEME.TEXT1,
                  },
                }}
              />
            )} */}
          </View>
        </TouchableOpacity>
      )}
      {isEditLable && (
        <View
          style={[
            styles.container,
            {
              backgroundColor: THEME.FOOTER,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: THEME.TEXT1,
              },
            ]}
          >
            {label?.label}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ paddingHorizontal: 4 }}>
              <Icon
                icon={ICONS.EDIT}
                width={20}
                height={20}
                action={() => setIsDialogInputVisible(true)}
              />
            </View>
            <View style={{ paddingHorizontal: 4 }}>
              <Icon
                icon={ICONS.DELETE}
                width={20}
                height={20}
                action={() => deleteLabel(user?.uid, label?._id)}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
}

export default withTheme(ListTemplate);
