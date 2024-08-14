import { themeType } from "../HOC";

export interface customDialogInputProps{
    description:string,
    placeholder:string
    input?:string,
    isVisible:boolean, 
    onCancel:()=>void,
    onSubmit:(param:string)=>void
    theme:themeType,
}