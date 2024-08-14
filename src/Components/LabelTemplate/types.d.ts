import { themeType } from "../HOC"

export interface colorSchemeState{
    theme:{
        theme:string
    }
}

export interface labelTemplateTypes{
    icon:(...params: any[]) => React.JSX.Element, 
    labelId:string,
    numberOfNotes:number,
    theme:themeType,
    labelName:string,
}