// Firebase
import firestore from "@react-native-firebase/firestore";

import { STRINGS, STRINGS_FIREBASE } from "../Constants/Strings";
import { labelNotesDataType } from "../Screens/Labels/types";
import { reminderNotesDataType } from "../Screens/Reminder/types";

export const createReminder = async (uid: string | undefined, titleRef: string, articleData: string, dateRef: Date) => {
  try {
    await firestore()
      .collection(STRINGS.FIREBASE.USER)
      .doc(uid)
      .collection(STRINGS.FIREBASE.REMINDER)
      .add({
        title: titleRef,
        content: articleData,
        timeStamp: dateRef,
      })
      .then(() => {
      });
  } catch (e) {
  }
};

export const updateReminder = async (uid: string | undefined, noteId: string, titleRef: string, articleData: string, dateRef: Date) => {
  try {
    await firestore()
      .collection(STRINGS.FIREBASE.USER)
      .doc(uid)
      .collection(STRINGS.FIREBASE.REMINDER)
      .doc(noteId)
      .update({
        title: titleRef,
        content: articleData,
        timeStamp: dateRef,
      })
      .then(() => {
        // console.log("reminder updated successfully");
      });
  } catch (e) {
    // console.log(e, "reminderrrr");
  }
};

export const updateData = async (uid: string | undefined, noteId: string, titleRef: string, articleData: string) => {
  try {
    await firestore()
      .collection(STRINGS.FIREBASE.USER)
      .doc(uid)
      .collection(STRINGS.FIREBASE.NOTES)
      .doc(noteId)
      .update({
        title: titleRef,
        content: articleData,
        time_stamp: firestore.FieldValue.serverTimestamp(),
      });
  } catch (e) {
  }
};

export const fetchReminderData = async (uid: string | undefined, setSearchData: (key: reminderNotesDataType) => void, setNotesData: (key: reminderNotesDataType) => void) => {
  try {
    if (uid) {
      const data = await firestore()
        .collection(STRINGS.FIREBASE.USER)
        .doc(uid)
        .collection(STRINGS.FIREBASE.REMINDER)
        .get();

      const newData: reminderNotesDataType = [];

      data.forEach((doc) => {
        newData.push({
          title: doc.data().title,
          data: doc.data().content,
          noteId: doc.id,
          id: uid,
          timestamp: doc.data().timeStamp,
        });
      });

      setNotesData(newData);
      setSearchData(newData);
    }
  } catch (error) {
  }
};


