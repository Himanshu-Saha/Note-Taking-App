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
        // console.log("new reminder added successfully");
      });
  } catch (e) {
    // console.log(e, STRINGS.FIREBASE.REMINDER);
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

// export const createN = async (uid: string | undefined, labelRef: string, noteNewId: React.RefObject<string | null | undefined>, titleRef: string, articleData: string) => {
//   await firestore()
//     .collection(STRINGS.FIREBASE.USER)
//     .doc(uid)
//     .collection(STRINGS.FIREBASE.NOTES)
//     .add({
//       label: labelRef,
//       title: titleRef,
//       content: articleData,
//       time_stamp: firestore.FieldValue.serverTimestamp(),
//       url: [],
//     })
//     .then((data) => {
//       (noteNewId as React.MutableRefObject<string | null>).current = data.id;
//     });
// };
// export const createNote = async (uid: string | undefined, labelRef: string, label: string, articleData: string, titleRef: string, noteNewId: React.RefObject<string | null | undefined>, img: string[]) => {
//   try {
//     if (labelRef === null) {
//       labelRef = label;
//     }
//     const regex = /^[\s\r\n]*$/;
//     if (
//       !regex.test(articleData) ||
//       !regex.test(titleRef) ||
//       img.length
//     ) {
//       createN(uid, labelRef, noteNewId, titleRef, articleData);
//       const count = await firestore()
//         .collection(STRINGS.FIREBASE.USER)
//         .doc(uid)
//         .collection(STRINGS.FIREBASE.LABELS)
//         .doc(labelRef)
//         .get();

//       let updatedcount = count.data();
//       if (updatedcount) updatedcount = updatedcount["count"] + 1;
//       await firestore()
//         .collection(STRINGS.FIREBASE.USER)
//         .doc(uid)
//         .collection(STRINGS.FIREBASE.LABELS)
//         .doc(labelRef)
//         .set(
//           {
//             count: updatedcount,
//             time_stamp: firestore.FieldValue.serverTimestamp(),
//           },
//           { merge: true }
//         );
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

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
    // console.log(e);
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

      const newData: reminderNotesDataType = []; // Temporary array to accumulate data

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
    // console.error("Error fetching data:", error);
  }
};


