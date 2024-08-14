// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import withTheme from '../HOC';
import { styles } from './style';
import { dateTimeProps } from './type';

function DateTime({date, setDate,theme}:dateTimeProps) {
  const [mode, setMode] = useState<"date"|"time">('date');
  const [show, setShow] = useState(false);

  const THEME = theme
  
  // const onChange = (event:DateTimePickerEvent,selectedDate:Date|undefined) => {
  //   setShow(false);
  //   if(selectedDate)
  //   setDate(selectedDate);
  // };

  const showMode = (currentMode:'date'|'time') => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <>
      <View style={[styles.container,{backgroundColor:THEME.SETTING_BOX}]}>
        <View style={styles.subContainer}>
          <View>
            <Text style={[styles.text,{color:THEME.TEXT1,fontWeight:'bold'}]}>Pick Date</Text>
          </View>
          <View>
            <TouchableOpacity onPress={showDatepicker}>
              <Text style={[styles.text,{color:THEME.TEXT1}]}>
                {date.toLocaleString().slice(0,10)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.subContainer]}>
          <View>
            <Text style={[styles.text,{color:THEME.TEXT1,fontWeight:'bold'}]}>Pick Time</Text>
          </View>
          <View>
            <TouchableOpacity onPress={showTimepicker}>
              <Text style={[styles.text,{color:THEME.TEXT1}]}>
                {date.toLocaleString().slice(11)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {show && (
        // <DateTimePicker
        //   testID="dateTimePicker"
        //   value={date}
        //   mode={mode}
        //   is24Hour={true}
        //   onChange={onChange}
        // />
      )}
    </>
  );
}

export default withTheme(DateTime)

