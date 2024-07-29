import { default as auth } from '@react-native-firebase/auth';
import { Formik } from 'formik';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CustomButton from '../../Components/Button/customButton';
import FormikTemplate from '../../Components/FormikTemplate';
import withTheme from '../../Components/HOC';
import { PLATEFORM, STRINGS } from '../../Constants/Strings';
import { createUser, SignupSchema, signUpUser } from '../../Utils';
import { styles } from './style';
import { SignUpProps, valuesTypes } from './types';

// utils
function SignUp({ navigation,theme }:SignUpProps) {
  const dispatch = useDispatch()
  const THEME = theme 
  return (
    
      <SafeAreaView style={[styles.container,{backgroundColor:THEME.BACKGROUND}]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === PLATEFORM.IOS ? 'padding' : 'height'}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.subContainer}>
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  number: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={(values)=>createUser(values,dispatch,navigation)}>
                {({
                  handleSubmit,
                  touched,
                  isValid,
                  values,
                  setFieldTouched,
                  handleChange,
                  errors,
                }) => (
                  <View>
                    <FormikTemplate
                      placeholder={STRINGS.FIRST_NAME}
                      values={values.firstName}
                      touched={touched.firstName}
                      onChangeText={handleChange(STRINGS.FIRST_NAME_SMALL)}
                      onBlur={() => setFieldTouched(STRINGS.FIRST_NAME_SMALL)}
                      error={errors.firstName}
                    />
                    <FormikTemplate
                      placeholder={STRINGS.LAST_NAME}
                      values={values.lastName}
                      touched={touched.lastName}
                      onChangeText={handleChange(STRINGS.LAST_NAME_SMALL)}
                      onBlur={() => setFieldTouched(STRINGS.LAST_NAME_SMALL)}
                      error={errors.lastName}
                    />
                    <FormikTemplate
                      placeholder={STRINGS.EMAIL}
                      values={values.email}
                      touched={touched.email}
                      onChangeText={handleChange('email')}
                      onBlur={() => setFieldTouched('email')}
                      error={errors.email}
                    />
                    <FormikTemplate
                      placeholder="Password"
                      values={values.password}
                      touched={touched.password}
                      onChangeText={handleChange(STRINGS.PASSWORD_SMALL)}
                      onBlur={() => setFieldTouched(STRINGS.PASSWORD_SMALL)}
                      error={errors.password}
                    />
                    <FormikTemplate
                      placeholder={STRINGS.CONFIRM_PASSWORD}
                      values={values.confirmPassword}
                      touched={touched.confirmPassword}
                      onChangeText={handleChange(STRINGS.CONFIRM_PASSWORD_SMALL)}
                      onBlur={() => setFieldTouched(STRINGS.CONFIRM_PASSWORD_SMALL)}
                      error={errors.confirmPassword}
                    />
                    <FormikTemplate
                      placeholder={STRINGS.PHONE_NUMBER}
                      values={values.number}
                      touched={touched.number}
                      onChangeText={handleChange(STRINGS.PHONE_NUMBER_SMALL)}
                      onBlur={() => setFieldTouched(STRINGS.PHONE_NUMBER_SMALL)}
                      error={errors.number}
                    />
                    <Text style={[styles.text,{color:THEME.TEXT1}]}>
                      {STRINGS.SIGN_UP_CONDITIONS}
                    </Text>
                    <CustomButton
                      text={STRINGS.SUBMIT}
                      onPress={handleSubmit}
                      disabled={!isValid}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    
  );
}

export default withTheme(SignUp)