import auth from '@react-native-firebase/auth';
import { Formik } from 'formik';
import { Keyboard, SafeAreaView, View } from 'react-native';
import * as Yup from 'yup';
import CustomButton from '../../Components/Button/customButton';
import FormikTemplate from '../../Components/FormikTemplate';
import { STRINGS, YUP_STRINGS } from '../../Constants/Strings';
import { toastInfo } from '../../Utils/toast';
import { styles } from '../LogIn/style';
 
const SignupSchema = Yup.object().shape({
  email: Yup.string().email(YUP_STRINGS.INVALID_EMAIL).required(YUP_STRINGS.ENTER_EMAIL)
});

async function reset(email:string){
    await auth().sendPasswordResetEmail(email).then(() => {
        toastInfo(STRINGS.RESET_PASSWORD_LINK)
      }).catch(function (e) {
        toastInfo(STRINGS.RESET_LINK_FAILED)
        console.log(e)
      })
}
export default function ResetPassword() {
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.subContainer}>
            <Formik
              initialValues={{email: ''}}
              validationSchema={SignupSchema}
              onSubmit={values => {
                reset(values.email);
              }}>
              {({
                errors,
                touched,
                isValid,
                handleChange,
                values,
                setFieldTouched,
                handleSubmit,
              }) => (
                <View>
                  <FormikTemplate
                    placeholder={STRINGS.EMAIL}
                    values={values.email}
                    touched={touched.email}
                    onChangeText={handleChange('email')}
                    onBlur={() => {setFieldTouched('email');
                    Keyboard.dismiss();}
                    }
                    error={errors.email}
                  />
                  <CustomButton
                    text={STRINGS.RESET_PASSWORD}
                    onPress={handleSubmit}
                    disabled={!isValid}
                    style={[styles.button]}
                  />
                </View>
              )}
            </Formik>
          </View>
        </SafeAreaView>)

}
