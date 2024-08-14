import { Platform, StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { LIGHT_THEME_COLOR } from "../../Constants/Colors";
// Enter
export const styles = StyleSheet.create({
    container:{
        backgroundColor:LIGHT_THEME_COLOR.BACKGROUND,
        flex:1,
        // justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        paddingTop:heightPercentageToDP('8%')
    },
    subContainer:{
        alignItems:'center',
        alignContent:'center',
    },
    // customText
    text1:{
        fontFamily:'Nunito', 
        fontWeight:'bold',
        color:LIGHT_THEME_COLOR.TEXT2,
        fontSize:heightPercentageToDP('3.5%')       
    },
    text2:{
        fontFamily:'Nunito', 
        fontWeight:'bold',
        color:LIGHT_THEME_COLOR.TEXT1,
        fontSize:heightPercentageToDP('3.5%')        
    },
    textSave:{
        fontSize:heightPercentageToDP('3%'),
        fontFamily:'Nunito',
        color:LIGHT_THEME_COLOR.SAVE
    },
    font:{
        fontWeight:'bold'
    },
    svg:{
        marginVertical:heightPercentageToDP('5%'),
        paddingLeft:widthPercentageToDP('30%')
    },
    simpleText:{
        fontSize:heightPercentageToDP('1.8%'),
        fontFamily:'Nunito',
        color:LIGHT_THEME_COLOR.TEXT1,
        paddingTop:heightPercentageToDP('.5%')
    },
    footer:{
        flexDirection:'row'
    },
    colorText:{
        color:LIGHT_THEME_COLOR.BACKGROUND1,
        paddingTop:heightPercentageToDP('1%'),
        fontWeight:'bold'
    },
    viewText:{
        flexDirection:'row'
    },
    google: {
        paddingTop: heightPercentageToDP('1%'),
      },
      googleContainer: {
        flexDirection: 'row',
        borderRadius: 50,
        backgroundColor: 'white',
        width: widthPercentageToDP('82%'),
        padding: widthPercentageToDP('4%'),
        alignContent: 'center',
        justifyContent: 'center',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          android: {
            elevation: 3,
          },
        }),
      },
      text: {
        fontSize: heightPercentageToDP('2%'),
        paddingLeft: widthPercentageToDP('2.5%'),
        color: LIGHT_THEME_COLOR.GOOGLE,
        fontWeight: 'bold',
      },
})
