import React, { useState } from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import withTheme from '../HOC';
import { styles } from './style';
import { dropdownComponentProps } from './types';

  const DropdownComponent = ({data,value, setValue,theme}:dropdownComponentProps) => {
    const [isFocus, setIsFocus] = useState(false);
    const labelData:{label:string}[] = []    
    
    const THEME = theme     

    data.forEach((label)=>{
        labelData.push({'label':label.labelName})
    })
    
    return (
      <View style={[styles.container,{backgroundColor:THEME?.BACKGROUND}]}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'white' }]}
          placeholderStyle={[styles.placeholderStyle,{color:THEME?.NOTETEXT}]}
          selectedTextStyle={[styles.selectedTextStyle,{color:THEME?.NOTETEXT}]}
          data={labelData}
          itemTextStyle={{color:THEME?.TEXT1}}
          containerStyle={{backgroundColor:THEME?.BACKGROUND}}
          activeColor={THEME?.BACKGROUND}
          maxHeight={heightPercentageToDP('30%')}
          labelField="label"
          valueField="label"
          placeholder={!isFocus ? 'Select Label' : '...'}
          value={!isFocus ? 'Select Label' : value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item:{label:string}) => {
            setValue(item.label);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

  export default withTheme(DropdownComponent);
