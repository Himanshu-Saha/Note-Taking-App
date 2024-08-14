import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import ADD from '../Assets/Svg/add.svg'
import BACK from '../Assets/Svg/back.svg'
import BELL from '../Assets/Svg/bell.svg'
import BELL_BLACK from '../Assets/Svg/bell_black.svg'
import BELL_BLACK_DARK from '../Assets/Svg/bell_black_dark.svg'
import BELL_DARK from '../Assets/Svg/bell_dark.svg'
import BOOK from '../Assets/Svg/book.svg'
import CAMERA from '../Assets/Svg/camera.svg'
import CHECKS_BLACK from '../Assets/Svg/check_black.svg'
import CHECKS_BLACK_DARK from '../Assets/Svg/check_black_dark.svg'
import CHECKS_DARK from '../Assets/Svg/check_dark.svg'
import CHECKS from '../Assets/Svg/checks.svg'
import CROSS from '../Assets/Svg/cross-svgrepo-com.svg'
import DELETE from '../Assets/Svg/delete.svg'
import DAIRY from '../Assets/Svg/diary.svg'
import DOC from '../Assets/Svg/doc.svg'
import DOC_BLACK from '../Assets/Svg/doc_Black.svg'
import DOC_BLACK_DARK from '../Assets/Svg/doc_black_dark.svg'
import DOC_DARK from '../Assets/Svg/doc_dark.svg'
import EDIT from '../Assets/Svg/edit.svg'
import EYE from '../Assets/Svg/eye.svg'
import EYE_CLOSE from '../Assets/Svg/eye_close.svg'
import GOOGLE from '../Assets/Svg/google.svg'
import TICK from '../Assets/Svg/icons8-tick.svg'
import INTEL from '../Assets/Svg/intel.svg'
import INTEL_BLACK from '../Assets/Svg/intel_dark.svg'
import OTHERS from '../Assets/Svg/others.svg'
import PERSONAL from '../Assets/Svg/personal.svg'
import PIECHART from '../Assets/Svg/piechart.svg'
import PIECHART_BLACK from '../Assets/Svg/piechartBlack.svg'
import PLUS2 from '../Assets/Svg/plus-svgrepo-com.svg'
import SEARCH from '../Assets/Svg/search.svg'
import SETTING from '../Assets/Svg/setting.svg'
import SETTING_BLACK from '../Assets/Svg/setting_black.svg'
import SETTINGS_BLACK_DARK from '../Assets/Svg/setting_black_dark.svg'
import SETTINGS_DARK from '../Assets/Svg/setting_dark.svg'
const iconStyle = (
  width = 0,
  height = 0,
  color = 'black',
  borderColor = 'none',
) => ({
  width: RFValue(width),
  height: RFValue(height),
  fill: color,
  stroke: borderColor,
})

export const ICONS = {
  BELL: (...params) => <BELL {...iconStyle(...params)} />,
  EDIT: (...params) => <EDIT {...iconStyle(...params)} />,
  DAIRY: (...params) => <DAIRY {...iconStyle(...params)} />,
  OTHERS: (...params) => <OTHERS {...iconStyle(...params)} />,
  PERSONAL: (...params) => <PERSONAL {...iconStyle(...params)} />,
  PIECHART: (...params) => <PIECHART {...iconStyle(...params)} />,
  CHECKS: (...params) => <CHECKS {...iconStyle(...params)} />,
  DOC: (...params) => <DOC {...iconStyle(...params)} />,
  SETTING: (...params) => <SETTING {...iconStyle(...params)} />,
  INTEL: (...params) => <INTEL {...iconStyle(...params)} />,
  ADD: (...params) => <ADD {...iconStyle(...params)} />,
  SEARCH: (...params) => <SEARCH {...iconStyle(...params)} />,
  BACK: (...params) => <BACK {...iconStyle(...params)} />,
  BOOK: (...params) => <BOOK {...iconStyle(...params)} />,
  EYE: (...params) => <EYE {...iconStyle(...params)} />,
  PLUS2: (...params) => <PLUS2 {...iconStyle(...params)} />,
  TICK: (...params) => <TICK {...iconStyle(...params)} />,
  GOOGLE: (...params) => <GOOGLE {...iconStyle(...params)} />,
  CROSS: (...params) => <CROSS {...iconStyle(...params)} />,
  DOC_BLACK: (...params) => <DOC_BLACK {...iconStyle(...params)} />,
  CHECKS_BLACK: (...params) => <CHECKS_BLACK {...iconStyle(...params)} />,
  BELL_BLACK: (...params) => <BELL_BLACK {...iconStyle(...params)} />,
  SETTING_BLACK: (...params) => <SETTING_BLACK {...iconStyle(...params)} />,
  INTEL_BLACK: (...params) => <INTEL_BLACK {...iconStyle(...params)} />,
  SETTINGS_DARK: (...params) => <SETTINGS_DARK {...iconStyle(...params)} />,
  SETTINGS_BLACK_DARK: (...params) => <SETTINGS_BLACK_DARK {...iconStyle(...params)} />,
  BELL_BLACK_DARK: (...params) => <BELL_BLACK_DARK {...iconStyle(...params)} />,
  CHECKS_BLACK_DARK: (...params) => <CHECKS_BLACK_DARK {...iconStyle(...params)} />,
  BELL_DARK: (...params) => <BELL_DARK {...iconStyle(...params)} />,
  DOC_DARK: (...params) => <DOC_DARK {...iconStyle(...params)} />,
  CHECKS_DARK: (...params) => <CHECKS_DARK {...iconStyle(...params)} />,
  DOC_BLACK_DARK: (...params) => <DOC_BLACK_DARK {...iconStyle(...params)} />,
  PIECHART_BLACK: (...params) => <PIECHART_BLACK {...iconStyle(...params)} />,
  CAMERA: (...params) => <CAMERA {...iconStyle(...params)} />,
  EYE_CLOSE: (...params) => <EYE_CLOSE {...iconStyle(...params)} />,
  DELETE: (...params) => <DELETE {...iconStyle(...params)} />,
}