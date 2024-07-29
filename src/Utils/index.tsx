import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImageResizer from 'react-native-image-resizer';
import { Dispatch, UnknownAction } from 'redux';
import * as Yup from 'yup';
import { SCREEN_CONSTANTS } from '../Constants';
import { FIREBASE_STRINGS, NOTES, STRINGS, YUP_STRINGS } from '../Constants/Strings';
import { logIn, updateUser } from '../Store/Common';
import { RootStackScreenProps } from '../Types/navigation';
import auth from "@react-native-firebase/auth";
import { AppDispatch } from '../Store';
import { Note, valuesTypes } from './types';
import { NativeStackNavigationConfig } from 'react-native-screens/lib/typescript/native-stack/types';

export const logInUser = async (email: string, password: string, dispatch: AppDispatch) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    dispatch(logIn(true));
    dispatch(
      updateUser({ uid: userCredential.user.uid })
    );
    await AsyncStorage.setItem(STRINGS.IS_LOGGED_IN, JSON.stringify(true));
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (values: valuesTypes, dispatch: AppDispatch, navigation: NativeStackNavigationConfig) => {
  try {
    let userCredentials = await auth().createUserWithEmailAndPassword(
      values.email,
      values.password,
    );
    await userCredentials.user.updateProfile({
      displayName: values.firstName + ' ' + values.lastName,
    });
    signUpUser(userCredentials.user, 'firebas e', dispatch, navigation)
  } catch (error) {
    // console.error('Error creating account:', error.code, error.message);
  }
};

export const signUpUser = async (user: FirebaseAuthTypes.User, providerId: string, dispatch: Dispatch<UnknownAction>, navigation: RootStackScreenProps<"SignUp">) => {
  try {
    const notes: Note[] = [
      {
        title: NOTES.ACADEMICS.TITLE,
        content: NOTES.ACADEMICS.CONTENT,
        url: [],
        time_stamp: firestore.FieldValue.serverTimestamp(),
      },
      {
        title: NOTES.OTHERS.TITLE,
        content: NOTES.OTHERS.CONTENT,
        url: [],
        time_stamp: firestore.FieldValue.serverTimestamp(),
      },
      {
        title: NOTES.PERSONAL.TITLE,
        content: NOTES.PERSONAL.CONTENT,
        url: [],
        time_stamp: firestore.FieldValue.serverTimestamp(),
      },
      {
        title: NOTES.WORK.TITLE,
        content: NOTES.WORK.CONTENT,
        url: [],
        time_stamp: firestore.FieldValue.serverTimestamp(),
      },
    ];
    const labels = [
      NOTES.ACADEMICS.NAME,
      NOTES.OTHERS.NAME,
      NOTES.PERSONAL.NAME,
      NOTES.WORK.NAME,
    ];
    const batch = firestore().batch();
    const collectionRef = firestore().collection(FIREBASE_STRINGS.USER);

    labels.forEach((label, index) => {
      const labelRef = collectionRef
        .doc(user.uid)
        .collection(FIREBASE_STRINGS.LABELS)
        .doc();
      batch.set(labelRef, { count: 1, label, time_stamp: firestore.FieldValue.serverTimestamp() });
      notes[index].label = labelRef;
    });

    notes.forEach((note) => {
      const newDocRef = firestore()
        .collection(FIREBASE_STRINGS.USER)
        .doc(user.uid)
        .collection(FIREBASE_STRINGS.NOTES)
        .doc();
      batch.set(newDocRef, note);
    });
    await batch.commit();
    // dispatch(logIn(true));
    // dispatch(
    //   updateUser({
    //     uid: user.uid,
    //     providerId: providerId,
    //   })
    // );
    // await AsyncStorage.setItem(STRINGS.IS_LOGGED_IN, JSON.stringify(true))
    navigation.navigate(SCREEN_CONSTANTS.Login);
  } catch (error) {
    console.error('Error creating initial database:', error.code, error.message);
  }
};

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required(STRINGS.FIRST_NAME_WARNING).matches(/^[A-Za-z]+$/, YUP_STRINGS.INVALID_FIRST_NAME),
  lastName: Yup.string().required(STRINGS.LAST_NAME_WARNING).matches(/^[A-Za-z]+$/, YUP_STRINGS.INVALID_LAST_NAME),
  email: Yup.string().email(YUP_STRINGS.INVALID_EMAIL).required(STRINGS.EMAIL_WARNING),
  password: Yup.string()
    .min(8)
    .required(STRINGS.PASSWORD_WARNING)
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      YUP_STRINGS.INVALID_PASSWORD,
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref(STRINGS.PASSWORD_SMALL)],
    YUP_STRINGS.PASSWORD_NOT_MATCH,
  ),
  number: Yup.string()
    .matches(/^\d{10}$/, YUP_STRINGS.PHONE_NUMBER_WARNING1)
    .required(YUP_STRINGS.PHONE_NUMBER_WARNING2)
});

export const imageCompressor = async (photo: string) => {
  try {
    const compressedImage = await ImageResizer.createResizedImage(
      photo,
      600, // max width
      400, // max height
      'JPEG',
      80,
    );
    return compressedImage.uri;
  } catch (error) {
    // console.log('Image compression error:', error);
    throw error;
  }
};

export const fetchAllData = async (uid: string) => {
  try {
    await firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(uid)
      .get();
  } catch (e) {
    // console.log(e, 91);
  }
}

export const fetchLabels = async (uid: string) => {
  try {
    const labelData = await firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(uid)
      .collection(FIREBASE_STRINGS.LABELS)
      .orderBy(FIREBASE_STRINGS.TIME_STAMP, FIREBASE_STRINGS.ORDER)
      .get();

    return labelData.docs.map((item) => ({
      labelName: item.data().label,
      labelId: item.id,
      count: item.data().count,
    }));
  } catch (e) {
    // console.log(e, 91);
  }
}
export const fetchNotesWithLabel = async (labelId: string,labelName:string, userId: string, setNotesData: any) => {
  try {
    const labelRef = firestore().collection(FIREBASE_STRINGS.USER).doc(userId).collection(FIREBASE_STRINGS.LABELS).doc(labelId);
    const notesData = await firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(userId)
      .collection(FIREBASE_STRINGS.NOTES)
      .where(FIREBASE_STRINGS.LABEL, '==', labelRef)
      .orderBy(FIREBASE_STRINGS.TIME_STAMP, FIREBASE_STRINGS.ORDER)
      .get();
    if (notesData.empty ) {
      console.log('No matching documents found.');
      setNotesData([]);
      return;
    }
    const notes = notesData.docs.map(note => ({
      noteId: note.id,
      content: note.data().content,
      labelRef: note.data().label,
      labelName,
      title: note.data().title,
      time_stamp: note.data().time_stamp,
    }));
    setNotesData(notes);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export const createNote = async (
  uid: string,
  labelId: string,
  title: string,
  content: string,
  // image:string[],
) => {
  const labelRef = firestore().collection(FIREBASE_STRINGS.USER).doc(uid).collection(FIREBASE_STRINGS.LABELS).doc(labelId);
  await firestore().collection(FIREBASE_STRINGS.USER).doc(uid).collection(FIREBASE_STRINGS.NOTES)
    .add(
      {
        label: labelRef,
        title: title,
        content: content,
        time_stamp: firestore.FieldValue.serverTimestamp(),
        url: [],
      }
    )
  labelRef.update({ count: firestore.FieldValue.increment(1) })
};

export const updateNote = async (
  uid: string,
  noteId: string,
  title: string,
  content: string,
) => {
  await firestore().collection(FIREBASE_STRINGS.USER).doc(uid).collection(FIREBASE_STRINGS.NOTES).doc(noteId)
    .update({ title, content, time_stamp: firestore.FieldValue.serverTimestamp(), });
};

export const createLabel = async (uid: string, labelName: string) => {
  await firestore().collection(FIREBASE_STRINGS.USER).doc(uid).collection(FIREBASE_STRINGS.LABELS).add({
    count: 0,
    label: labelName,
    time_stamp: firestore.FieldValue.serverTimestamp(),
  })
};
export const updateLabel = async (uid: string, labelName: string) => {
  await firestore().collection(FIREBASE_STRINGS.USER).doc(uid).collection(FIREBASE_STRINGS.LABELS).add({
    count: 0,
    label: labelName,
    time_stamp: firestore.FieldValue.serverTimestamp(),
  })
};