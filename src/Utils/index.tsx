import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ImageResizer from "react-native-image-resizer";
import { NativeStackNavigationConfig } from "react-native-screens/lib/typescript/native-stack/types";
import { UpdateMode } from "realm";
import * as Yup from "yup";
import { SCREEN_CONSTANTS } from "../Constants";
import {
  FIREBASE_STRINGS,
  NOTES,
  REALM,
  STRINGS,
  YUP_STRINGS,
} from "../Constants/Strings";
import { AppDispatch } from "../Store";
import { updateLogIn, updateProvider, updateUser } from "../Store/Common";
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
    dispatch(updateLogIn(true));
    dispatch(updateUser(userCredential.user));
    dispatch(updateProvider(userCredential.user.providerId));
    await AsyncStorage.clear();
    await AsyncStorage.setItem(STRINGS.IS_LOGGED_IN, JSON.stringify(true));
    await AsyncStorage.setItem("User", JSON.stringify(userCredential.user));
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
    signUpUser(userCredentials.user, navigation);
  } catch (error) {
    console.error("Error creating account:");
  }
};

export const signUpUser = async (
  user: FirebaseAuthTypes.User,
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
    // await AsyncStorage.setItem(STRINGS.IS_LOGGED_IN, JSON.stringify(true))
    navigation.navigate(SCREEN_CONSTANTS.Login);
  } catch (error) {
    console.error("Error creating initial database:");
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
      labelId: note.data().label.id,
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
  imageURL: string[]
) => {
  const labelRef = firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.LABELS)
    .doc(labelId);
  const newNoteRef = firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.NOTES)
    .doc();
  await newNoteRef.set({
    label: labelRef,
    title: title,
    content: content,
    time_stamp: firestore.FieldValue.serverTimestamp(),
    url: imageURL,
  });
  await labelRef.update({ count: firestore.FieldValue.increment(1) });
};

export const updateNote = async (
  uid: string,
  noteId: string,
  title: string,
  content: string,
  imageUrl: string[]
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
      url: firestore.FieldValue.arrayUnion(...imageUrl),
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
  const labelDoc = await labelRef.get();
  console.log(uid, noteId, labelId);
  if (!labelDoc.exists) {
    console.error(`Label with ID ${labelId} does not exist.`);
    return; // Or handle it as needed
  }
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
  return uploadedImageURLs;
  console.log("images uploaded successfully");
};

// realm and firestore

export async function syncFirestoreToRealm(uid: string, realmInstance: Realm) {
  const notesSnapshot = await firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.NOTES)
    .get();
  const labelsSnapshot = await firestore()
    .collection(FIREBASE_STRINGS.USER)
    .doc(uid)
    .collection(FIREBASE_STRINGS.LABELS)
    .get();

  realmInstance.write(() => {
    // realmInstance .deleteAll();
    notesSnapshot.docs.forEach((note) => {
      const data = note.data();
      // console.log(data);

      realmInstance.create(
        "Note",
        {
          _id: note.id,
          title: data.title,
          content: data.content,
          label: data.label.id,
          imagesURL: data.url,
          timestamp: data.time_stamp.toDate(),
          synced: true,
          status: REALM.STATUS.FIRESTORE,
        },
        UpdateMode.Modified
      );
    });
    labelsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      // console.log(data,);

      realmInstance.create(
        "Label",
        {
          _id: doc.id,
          label: data.label,
          count: data.count,
          timestamp: data.time_stamp.toDate(),
          synced: true,
          status: REALM.STATUS.FIRESTORE,
        },
        UpdateMode.Modified
      );
    });
  });
}

export function generateFirestoreId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}

export async function syncRealmImagesToFirestore(
  uid: string,
  realmInstance: Realm
) {
  let allImagesWithNoteId={};
  const images = realmInstance.objects("Image");
  // Sync images
  for (const image of images) {
    const urls = await uploadImages(uid, image.noteId, image.images);
    allImagesWithNoteId[image.noteId] = urls;
    realmInstance.write(() => {
      realmInstance.delete(image);
    });
  }
  return allImagesWithNoteId;
}

export async function syncRealmToFirestore(uid: string, realmInstance: Realm) {
  try {
    const notes = realmInstance.objects("Note");
    const labels = realmInstance.objects("Label");
    const batch = firestore().batch();
    const userRef = firestore().collection(FIREBASE_STRINGS.USER).doc(uid);
    const noteRef = userRef.collection(FIREBASE_STRINGS.NOTES);
    const labelRef = userRef.collection(FIREBASE_STRINGS.LABELS);
    const URLS = await syncRealmImagesToFirestore(uid,realmInstance);
    // Sync notes
    for (const note of notes) {
      if (!note.synced) {
        console.log(note, "note not synced");
        const docRef = noteRef.doc(note._id);
        try {
          switch (note.status) {
            case REALM.STATUS.ADD:
              const labelDataRef = labelRef.doc(note.label);
              batch.set(docRef, {
                title: note.title,
                content: note.content,
                url: URLS[note._id] ?? [],
                time_stamp: firestore.FieldValue.serverTimestamp(),
                label: labelDataRef,
              });
              realmInstance.write(() => (note.synced = true));
              break;

            case REALM.STATUS.MODIFY:
              const imageUrl = URLS[note._id] ?? [];
              const noteExist = await docRef.get();
              if (noteExist.exists) {
                batch.update(docRef, {
                  title: note.title,
                  content: note.content,
                  url: firestore.FieldValue.arrayUnion(...imageUrl),
                  time_stamp: firestore.FieldValue.serverTimestamp(),
                });
              }
              realmInstance.write(() => (note.synced = true));
              break;
            case REALM.STATUS.DELETE:
              const docSnapshot = await docRef.get();
              console.log(docSnapshot.data(), "chicmic");
              if (docSnapshot.exists) {
                batch.delete(docRef);
              } else {
                console.log(`Note with ID ${note._id} already deleted.`);
              }
              realmInstance.write(() => (note.synced = true));
              break;
          }
        } catch (error) {
          console.error(`Error processing note with ID ${note._id}:`, error);
          realmInstance.write(() => (note.synced = false));
        }
      }
    }

    // Sync labels
    for (const label of labels) {
      if (!label.synced) {
        const docRef = labelRef.doc(label._id);
        try {
          switch (label.status) {
            case REALM.STATUS.ADD:
              batch.set(docRef, {
                label: label.label,
                count: label.count,
                time_stamp: firestore.FieldValue.serverTimestamp(),
              });
              realmInstance.write(() => (label.synced = true));
              break;
            case REALM.STATUS.MODIFY:
              const labelExist = await docRef.get();
              if (labelExist.exists) {
                batch.update(docRef, {
                  label: label.label,
                  count: label.count,
                  time_stamp: firestore.FieldValue.serverTimestamp(),
                });
                realmInstance.write(() => (label.synced = true));
              }
              break;
            case REALM.STATUS.DELETE:
              const docSnapshot = await docRef.get();
              if (docSnapshot.exists) {
                batch.delete(docRef);
                realmInstance.write(() => (label.synced = true));
              } else {
                console.log(`Label with ID ${label._id} already deleted.`);
                realmInstance.write(() => (label.synced = true));
              }
              break;
          }
        } catch (error) {
          console.error(`Error processing label with ID ${label._id}:`, error);
          realmInstance.write(() => (label.synced = false)); // Optionally handle individual label errors
        }
      }
    }

    try {
      await batch.commit();
      console.log("Batch committed successfully");
    } catch (error) {
      console.error("Batch commit failed:", error);
      notes.forEach((note) => {
        note.synced = false; // Optionally reset synced status or take other corrective actions
      });
      labels.forEach((label) => {
        label.synced = false; // Optionally reset synced status or take other corrective actions
      });
    }
  } catch (error) {
    console.error("Error in syncRealmToFirestore:", error);
  }
}

// realm

export function addNoteToRealm(note, realmInstance: Realm) {
  const noteData = {
    _id: generateFirestoreId(),
    title: note.title,
    content: note.content,
    label: note.label,
    imagesURL: note.imagesURL || [],
    timestamp: new Date(),
    synced: false,
    status: REALM.STATUS.ADD,
  };

  realmInstance.write(() => {
    realmInstance.create("Note", noteData);
    let label = realmInstance.objectForPrimaryKey("Label", note.label);
    if (label) {
      label.count = label.count + 1; // Ensure count is incremented properly
    } else {
      console.error(`Label with ID ${note.label} does not exist.`);
    }
  });

  console.log("Note added to Realm");
}

export function updateNoteInRealm(note, realmInstance: Realm) {
  realmInstance.write(() => {
    let existingNote = realmInstance.objectForPrimaryKey("Note", note._id);
    if (existingNote && existingNote.status !== REALM.STATUS.DELETE) {
      existingNote.title = note.title;
      existingNote.content = note.content;
      existingNote.label = note.label;
      existingNote.imagesURL = [];
      existingNote.timestamp = new Date();
      existingNote.status === REALM.STATUS.ADD
        ? REALM.STATUS.ADD
        : REALM.STATUS.MODIFY;
      existingNote.synced = false;
    } else {
      console.error(`Note with ID ${note._id} does not exist.`);
    }
  });

  console.log("Note updated in Realm");
}

export function deleteNoteFromRealm(noteId: string, realmInstance: Realm) {
  realmInstance.write(() => {
    let noteToDelete = realmInstance.objectForPrimaryKey("Note", noteId);

    if (noteToDelete) {
      let label = realmInstance.objectForPrimaryKey(
        "Label",
        noteToDelete.label
      );
      if (label) {
        label.count = label.count - 1;
        if (label.count < 0) {
          label.count = 0;
        }
      }
      // realmInstance.delete(noteToDelete);
      console.log(noteToDelete);

      noteToDelete.status = REALM.STATUS.DELETE;
      noteToDelete.synced = false;
    } else {
      console.error(`Note with ID ${noteId} does not exist.`);
    }
  });

  console.log("Note deleted from Realm");
}

export function addLabelToRealm(labelName: string, realmInstance: Realm) {
  const labelData = {
    _id: generateFirestoreId(), // Ensure this function generates unique IDs
    label: labelName,
    count: 0,
    timestamp: new Date(),
    synced: false,
    status: REALM.STATUS.ADD,
  };

  realmInstance.write(() => {
    realmInstance.create("Label", labelData);
  });

  console.log("Label added to Realm");
}

export function updateLabelInRealm(
  labelId: string,
  newLabelName: string,
  realmInstance: Realm
) {
  realmInstance.write(() => {
    let existingLabel = realmInstance.objectForPrimaryKey("Label", labelId);
    if (existingLabel && existingLabel.status !== REALM.STATUS.DELETE) {
      existingLabel.label = newLabelName;
      existingLabel.timestamp = new Date();
      existingLabel.status === REALM.STATUS.ADD
        ? REALM.STATUS.ADD
        : REALM.STATUS.MODIFY;
      existingLabel.synced = false;
    } else {
      console.error(`Label with ID ${labelId} does not exist.`);
    }
  });

  console.log("Label updated in Realm");
}

export function deleteLabelFromRealm(labelId: string, realmInstance: Realm) {
  realmInstance.write(() => {
    let labelToDelete = realmInstance.objectForPrimaryKey("Label", labelId);
    if (labelToDelete) {
      let notesToDelete = realmInstance
        .objects("Note")
        .filtered("label = $0", labelId);
      notesToDelete.forEach((note) => {
        deleteNoteFromRealm(note._id, realmInstance);
      });
      // realmInstance.delete(notesToDelete);
      // realmInstance.delete(labelToDelete);
      labelToDelete.status = REALM.STATUS.DELETE;
      labelToDelete.synced = false;
    } else {
      console.error(`Label with ID ${labelId} does not exist.`);
    }
  });

  console.log("Label deleted from Realm");
}

export function uploadImageToRealm(
  noteId: string,
  localImagePaths: string[],
  realmInstance: Realm
) {
  realmInstance.write(() => {
    let existingImageRecord = realmInstance.objectForPrimaryKey(
      "Image",
      noteId
    );

    if (existingImageRecord) {
      const prevImages = existingImageRecord.images;
      existingImageRecord.images = [...prevImages, ...localImagePaths];
    } else {
      realmInstance.create(
        "Image",
        {
          noteId: noteId,
          images: localImagePaths,
        },
        Realm.UpdateMode.Modified
      );
    }
  });
}
