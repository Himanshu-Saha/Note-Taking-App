import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ImageResizer from "react-native-image-resizer";
import { NativeStackNavigationConfig } from "react-native-screens/lib/typescript/native-stack/types";
import { Dispatch, UnknownAction } from "redux";
import * as Yup from "yup";
import { SCREEN_CONSTANTS } from "../Constants";
import {
  FIREBASE_STRINGS,
  NOTES,
  STRINGS,
  YUP_STRINGS,
} from "../Constants/Strings";
import { AppDispatch } from "../Store";
import { logIn, updateUser } from "../Store/Common";
import { RootStackScreenProps } from "../Types/navigation";
import { Note, valuesTypes } from "./types";
export const logInUser = async (
  email: string,
  password: string,
  dispatch: AppDispatch
) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    dispatch(logIn(true));
    dispatch(updateUser({ uid: userCredential.user.uid }));
    await AsyncStorage.setItem(STRINGS.IS_LOGGED_IN, JSON.stringify(true));
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (
  values: valuesTypes,
  dispatch: AppDispatch,
  navigation: NativeStackNavigationConfig
) => {
  try {
    let userCredentials = await auth().createUserWithEmailAndPassword(
      values.email,
      values.password
    );
    await userCredentials.user.updateProfile({
      displayName: values.firstName + " " + values.lastName,
    });
    signUpUser(userCredentials.user, "firebas e", dispatch, navigation);
  } catch (error) {
    // console.error('Error creating account:', error.code, error.message);
  }
};

export const signUpUser = async (
  user: FirebaseAuthTypes.User,
  providerId: string,
  dispatch: Dispatch<UnknownAction>,
  navigation: RootStackScreenProps<"SignUp">
) => {
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
      batch.set(labelRef, {
        count: 1,
        label,
        time_stamp: firestore.FieldValue.serverTimestamp(),
      });
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
    console.error(
      "Error creating initial database:",
      error.code,
      error.message
    );
  }
};

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required(YUP_STRINGS.FIRST_NAME_WARNING)
    .matches(/^[A-Za-z]+$/, YUP_STRINGS.INVALID_FIRST_NAME),
  lastName: Yup.string()
    .required(YUP_STRINGS.LAST_NAME_WARNING)
    .matches(/^[A-Za-z]+$/, YUP_STRINGS.INVALID_LAST_NAME),
  email: Yup.string()
    .email(YUP_STRINGS.INVALID_EMAIL)
    .required(YUP_STRINGS.EMAIL_WARNING),
  password: Yup.string()
    .required(YUP_STRINGS.PASSWORD_WARNING)
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      YUP_STRINGS.INVALID_PASSWORD
    ),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref(YUP_STRINGS.PASSWORD_SMALL)],
      YUP_STRINGS.PASSWORD_NOT_MATCH
    )
    .required(YUP_STRINGS.CONFIRM_PASSWORD),
});

export const fetchAllData = async (uid: string) => {
  try {
    await firestore().collection(FIREBASE_STRINGS.USER).doc(uid).get();
  } catch (e) {
    // console.log(e, 91);
  }
};

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
};

export const fetchNotesWithLabel = async (
  labelId: string,
  labelName: string,
  userId: string,
  setNotesData: any
) => {
  try {
    const labelRef = firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(userId)
      .collection(FIREBASE_STRINGS.LABELS)
      .doc(labelId);
    const notesData = await firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(userId)
      .collection(FIREBASE_STRINGS.NOTES)
      .where(FIREBASE_STRINGS.LABEL, "==", labelRef)
      .orderBy(FIREBASE_STRINGS.TIME_STAMP, FIREBASE_STRINGS.ORDER)
      .get();
    if (notesData.empty) {
      console.log("No matching documents found.");
      setNotesData([]);
      return;
    }
    const notes = notesData.docs.map((note) => ({
      noteId: note.id,
      content: note.data().content,
      labelRef: note.data().label,
      labelId:note.data().label.id,
      labelName,
      title: note.data().title,
      time_stamp: note.data().time_stamp,
    }));
    setNotesData(notes);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const createNote = async (
  uid: string,
  labelId: string,
  title: string,
  content: string,
  imageURL:string[]
) => {
  const labelRef = firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.LABELS)
    .doc(labelId);
  const newNoteRef = await firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.NOTES)
    .doc();
    const URL = await uploadImages(uid, newNoteRef.id, imageURL).catch((e) =>
      console.log(e)
    );
   await newNoteRef.set({
      label: labelRef,
      title: title,
      content: content,
      time_stamp: firestore.FieldValue.serverTimestamp(),
      url: URL,
    });
  await labelRef.update({ count: firestore.FieldValue.increment(1) });
};

export const updateNote = async (
  uid: string,
  noteId: string,
  title: string,
  content: string
) => {
  await firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.NOTES)
    .doc(noteId)
    .update({
      title,
      content,
      time_stamp: firestore.FieldValue.serverTimestamp(),
    });
};

export const deleteNote = async (
  uid: string,
  noteId: string,
  labelId: string
) => {
  const userRef = firestore().collection(FIREBASE_STRINGS.USER).doc(uid);
  const noteRef = userRef.collection(FIREBASE_STRINGS.NOTES).doc(noteId);
  const labelRef = userRef.collection(FIREBASE_STRINGS.LABELS).doc(labelId);
  await labelRef.update({ count: firestore.FieldValue.increment(-1) });
  await noteRef.delete();
};

export const createLabel = async (uid: string, labelName: string) => {
  await firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.LABELS)
    .add({
      count: 0,
      label: labelName,
      time_stamp: firestore.FieldValue.serverTimestamp(),
    });
};

export const updateLabel = async (
  uid: string,
  labelId: string,
  labelName: string
) => {
  await firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.LABELS)
    .doc(labelId)
    .update({
      label: labelName,
      time_stamp: firestore.FieldValue.serverTimestamp(),
    });
};

export const deleteLabel = async (uid: string, labelId: string) => {
  const batch = firestore().batch();
  const labelRef = firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.LABELS)
    .doc(labelId);
  batch.delete(labelRef);
  const notesRef = firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.NOTES)
    .where(FIREBASE_STRINGS.LABEL, "==", labelRef);
  const notesRefList = await notesRef
    .get()
    .then((querySnapshot) => {
      const docRefs = querySnapshot.docs.map((doc) => doc.ref);
      return docRefs;
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
      return [];
    });
  notesRefList.forEach((element) => {
    batch.delete(element);
  });
  await batch.commit();
};

export const imageCompressor = async (photo: string) => {
  try {
    const compressedImage = await ImageResizer.createResizedImage(
      photo,
      600, // max width
      400, // max height
      "JPEG",
      80
    );
    return compressedImage.uri;
  } catch (error) {
    // console.log('Image compression error:', error);
    throw error;
  }
};

export const uploadImage = async () => {};

export const uploadImages = async (
  uid: string,
  noteId: string,
  imageURL: string[]
) => {
  if (!imageURL || imageURL.length === 0) {
    console.log("Empty imageURL");
    return;
  }  
  const uploadedImageURLs = await Promise.all(
    imageURL.map(async (image) => {
      const photoName = image.split("/").pop();
      const uniqueId = `${uid}/${noteId}/${new Date().getTime()}-${photoName}`;
      const reference = storage().ref(uniqueId);
      await reference.putFile(image);
      return reference.getDownloadURL();
    })
  );
  return uploadedImageURLs
  // await firestore()
  //   .collection(FIREBASE_STRINGS.USER)
  //   .doc(uid)
  //   .collection(FIREBASE_STRINGS.NOTES)
  //   .doc(noteId)
  //   .update({ url: uploadedImageURLs });
  console.log("images uploaded successfully");
};
