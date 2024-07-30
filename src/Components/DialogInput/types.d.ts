import { themeType } from "../HOC";

export interface customDialogInputProps{
    input:string,
    isVisible:boolean, 
    onCancel:()=>void,
    onSubmit:(param:string)=>void
    theme:themeType,
}