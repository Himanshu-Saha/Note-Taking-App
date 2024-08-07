import firestore from "@react-native-firebase/firestore";
import { useEffect } from "react";
import { FIREBASE_STRINGS } from "../../Constants/Strings";
import { RealmClassType } from "@realm/react/dist/helpers";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
// import { addNoteToRealm, updateNoteInRealm } from "../../RealmDB";

export const useUpdateLabel = (
  uid: string|undefined,
  setData: (
    key: { labelName: string; labelId: string; count: number }[]
  ) => void
) => {
  useEffect(() => {
    if(uid){
    const unsubscribe = firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(uid)
      .collection(FIREBASE_STRINGS.LABELS)
      .orderBy(FIREBASE_STRINGS.TIME_STAMP, FIREBASE_STRINGS.ORDER)
      .onSnapshot((querySnapshot) => {
        const labels = querySnapshot.docs.map((item) => ({
          labelName: item.data().label,
          labelId: item.id,
          count: item.data().count,
        }));
        setData(labels);
      });
    return () => {
      unsubscribe();
    };}
  }, [setData, uid]);
};

export const useFetchUpdatedLabelData = (
  labelId: string,
  labelName: string,
  userId: string,
  setNotesData: any,
  setSearchData: any
) => {
  useEffect(() => {
    const labelRef = firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(userId)
      .collection(FIREBASE_STRINGS.LABELS)
      .doc(labelId);
    const unsubscribe = firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(userId)
      .collection(FIREBASE_STRINGS.NOTES)
      .where(FIREBASE_STRINGS.LABEL, "==", labelRef)
      .orderBy(FIREBASE_STRINGS.TIME_STAMP, FIREBASE_STRINGS.ORDER)
      .onSnapshot((querySnapshot) => {
        const notes = querySnapshot.docs.map((note) => {
          return {
            noteId: note.id,
            content: note.data().content,
            labelRef: note.data().label,
            labelId: note.data().label.id,
            title: note.data().title,
            time_stamp: note.data().time_stamp,
            ImageUrl: note.data().url,
            id: userId,
            labelName,
          };
        });

        setNotesData(notes);
        setSearchData(notes);
      });
    return () => unsubscribe();
  }, []);
};

export const useFirebaseListener = (userId: string) => {
  useEffect(() => {
    if(userId){
    const unsubscribe = firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(userId)
      .collection(FIREBASE_STRINGS.NOTES)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const noteData = change.doc.data();
          
          switch (change.type) {
            case "added":
              // console.log(noteData,'added');
              // console.log(noteData);
              // addNoteToRealm(noteData);
              break;
            case "modified":
              // console.log(noteData,'Updated');
              
              // updateNoteInRealm(noteData);
              break;
            // case "removed":
            //   deleteNoteFromRealm(noteData.id);
            //   break;
          }
        });
      });
    return () => unsubscribe();}
  }, []);
};

export const useFetchAllNotesData = (userId: string, networkAvailable: boolean) => {
  useEffect(() => {
    if (networkAvailable && userId) {
      firestore()
        .collection(FIREBASE_STRINGS.USER)
        .doc(userId)
        .collection(FIREBASE_STRINGS.NOTES)
        .get()
        .then((noteData) => {
          const data = noteData.docs.map(doc => ({...doc.data(),_id:doc.id}));
          data.forEach((d)=>console.log(d,'data'))
        })
        .catch((e) => console.log(e));
    }
  }, [networkAvailable, userId]);
};

export const useFirestoreToRealmSync = (uid: string) => {
  const realmInstance = useRealm();
  useEffect(() => {
    const unsubscribeNotes = firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(uid)
      .collection(FIREBASE_STRINGS.NOTES)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data();
          realmInstance.write(() => {
            if (change.type === 'added' || change.type === 'modified') {
              realmInstance.create('Note', {
                _id: change.doc.id,
                title: data.title,
                content: data.content,
                label: data.label.id,
                imagesURL: data.url,
                timestamp: data.time_stamp.toDate(),
              }, UpdateMode.Modified);
            } else if (change.type === 'removed') {
              const noteToDelete = realmInstance.objectForPrimaryKey('Note', new BSON.UUID(change.doc.id));
              if (noteToDelete) {
                realmInstance.delete(noteToDelete);
              }
            }
          });
        });
      });

    const unsubscribeLabels = firestore()
      .collection(FIREBASE_STRINGS.USER)
      .doc(uid)
      .collection(FIREBASE_STRINGS.LABELS)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data();
          realmInstance.write(() => {
            if (change.type === 'added' || change.type === 'modified') {
              realmInstance.create('Label', {
                _id: change.doc.id,
                label: data.label,
                count: data.count,
                timestamp: data.time_stamp.toDate(),
              }, UpdateMode.Modified);
            } else if (change.type === 'removed') {
              const labelToDelete = realmInstance.objectForPrimaryKey('Label', new BSON.UUID(change.doc.id));
              if (labelToDelete) {
                realmInstance.delete(labelToDelete);
              }
            }
          });
        });
      });
    return () => {
      unsubscribeNotes();
      unsubscribeLabels();
    };
  }, [uid, realmInstance]);
};