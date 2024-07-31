import React, { useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomButton from "../../Components/Button/customButton";
import FormikTemplate from "../../Components/FormikTemplate";
import withTheme from "../../Components/HOC";
import { SCREEN_CONSTANTS } from "../../Constants";
import { STRINGS, YUP_STRINGS } from "../../Constants/Strings";
import { logIn, updateUser } from "../../Store/Common";
import { useAppDispatch, useAppSelector } from "../../Store";
import { styles } from "./style";
import { LogInProps } from "./types";
import { logInUser } from "../../Utils";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email(YUP_STRINGS.INVALID_EMAIL).required(YUP_STRINGS.ENTER_EMAIL),
  password: Yup.string()
    .min(8)
    .required(YUP_STRINGS.ENTER_PASSWORD)
});

const LogIn: React.FC<LogInProps> = ({ navigation, theme }) => {
  const [errorLogin, setErrorLogin] = useState(false);

  const isLogedIn = useAppSelector((state) => state.common.isLogedIn);
  const dispatch = useAppDispatch();

  const THEME = theme;



  const forgot = () => {
    navigation.navigate(SCREEN_CONSTANTS.ForgotPassword);
  };


  if (errorLogin) {
    Alert.alert(STRINGS.INVALID_CREDENTIALS);
    setErrorLogin(false); // Reset error state after showing the alert
  }

  if (!isLogedIn) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: THEME.BACKGROUND }]}>
        <View style={styles.subContainer}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              logInUser(values.email, values.password,dispatch);
            }}
          >
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
                {errorLogin && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.error}>
                      {STRINGS.EMPTY_CREDENTIALS}
                    </Text>
                  </View>
                )}
                <FormikTemplate
                  placeholder={STRINGS.EMAIL}
                  values={values.email}
                  touched={touched.email}
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  error={errors.email}
                  logIn={true}
                />
                <FormikTemplate
                  placeholder={STRINGS.PASSWORD}
                  values={values.password}
                  touched={touched.password}
                  onChangeText={handleChange(STRINGS.PASSWORD_SMALL)}
                  onBlur={() => setFieldTouched(STRINGS.PASSWORD_SMALL)}
                  error={errors.password}
                  logIn={true}
                />
                <Text onPress={forgot} style={styles.colorText}>
                  {STRINGS.FORGOT_PASSWORD}
                </Text>
                <Text style={{ color: THEME.TEXT1 }}>
                  {STRINGS.SIGN_UP_CONDITIONS}
                </Text>
                <CustomButton
                  text={STRINGS.LOG_IN}
                  onPress={() => handleSubmit()}
                  style={[styles.button]}
                />
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    );
  } else {
    navigation.navigate(SCREEN_CONSTANTS.HomeNavigation);
    return null;
  }
};

export default withTheme(LogIn);
