import { HTMLSource } from "react-native-render-html";
import { Label, Note } from "../../RealmDB";
import { themeType } from "../HOC";

export interface TimestampType {
  seconds: number;
  nanoseconds: number;
}

export interface NoteType {
  title?: string;
  data?: string | HTMLSource;
  noteId?: string;
  id?: string;
  timestamp?: TimestampType | string;
}

export interface listTemplateTypes {
  note?: Note;
  maxHeight?: number;
  label?: Label;
  isEditLable?:boolean
  theme: themeType;
  labelDetails?:{ labelId: string; labelName: string } 
}
