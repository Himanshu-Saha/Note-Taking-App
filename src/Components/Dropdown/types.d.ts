
import { Label } from "../../RealmDB";
import { WithThemeProps } from "../HOC";


export interface dropdownComponentProps extends WithThemeProps{
    data:Label[],
    value:string, 
    setValue:(key:string)=>void,
    // theme?:themeType
}