export type newDataType = { 'id': string, labelId: string, 'count': number }[]

export interface HomeProps extends NativeStackScreenProps<RootTabParamList, 'home'> {
  theme: themeType;
}