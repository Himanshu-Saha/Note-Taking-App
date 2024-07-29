import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHTML, { HTMLSource } from "react-native-render-html";
import { SCREEN_CONSTANTS } from "../../Constants";
import withTheme from "../HOC";
import { styles } from "./style";
import { listTemplateTypes } from "./types";

function ListTemplate({ note, nav, maxHeight, label, theme }: listTemplateTypes) {
  const source: HTMLSource = {
    html: typeof note.content === 'string' ? note.content : ""
  };
  
  const { width: contentWidth } = useWindowDimensions();
  const THEME = theme;
  let date;
  if (typeof note.timestamp === 'string') {
    date = new Date(note.timestamp);
  } else if (note.timestamp) {
    date = new Date(
      note.timestamp.seconds * 1000 + note.timestamp.nanoseconds / 1000000
    );
  } else {
    date = 'error';
  }
  const formattedDate = date instanceof Date ? date.toLocaleString("en-US") : date;

  const title = () => {
    if (!note.title?.length) return "";
    else {
      if (note.title.length > 8) return note.title.slice(0, 8) + "...";
      else return note.title;
    }
  };

  return (
    <>
      {!label && (
        <TouchableOpacity
          onPress={() => nav.navigate(SCREEN_CONSTANTS.Note, { note })}
          style={[styles.touch, { maxHeight }]}
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor: THEME.FOOTER,
                flexDirection: note.timestamp ? "row" : "column",
              },
            ]}
          >
            <View>
              {note.title && (
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
            {note.timestamp && (
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
            )}
          </View>
        </TouchableOpacity>
      )}
      {label && (
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
            {note.id}
          </Text>
        </View>
      )}
    </>
  );
}

export default withTheme(ListTemplate);
