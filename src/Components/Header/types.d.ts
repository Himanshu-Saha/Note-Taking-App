import { Note } from "../../RealmDB";
import { WithThemeProps } from "../HOC";

export interface headerTypes extends WithThemeProps{
  onChangeText?:(e:string)=>void,
  notesData?:Note[],
  headerText:string,
  // theme?:themeType,
  handleSetInittialOnBlur?: () => void,
  showDelete?:boolean,
  handleDelete?:any
}