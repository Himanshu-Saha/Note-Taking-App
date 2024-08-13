import firestore from "@react-native-firebase/firestore";
import { useEffect } from "react";
import { UpdateMode } from "realm";
import { FIREBASE_STRINGS, REALM } from "../../Constants/Strings";
import { Note } from "../../RealmDB";
import { syncRealmToFirestore } from "../../Utils";
// import { addNoteToRealm, updateNoteInRealm } from "../../RealmDB";

export const useUpdateLabel = (
  uid: string | undefined,
  setData: (
    key: { labelName: string; labelId: string; count: number }[]
  ) => void
) => {
  useEffect(() => {
    if (uid) {
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
      };
    }
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

// export const useFirebaseListener = (userId: string) => {
//   useEffect(() => {
//     if (userId) {
//       const unsubscribe = firestore()
//         .collection(FIREBASE_STRINGS.USER)
//         .doc(userId)
//         .collection(FIREBASE_STRINGS.NOTES)
//         .onSnapshot((snapshot) => {
//           snapshot.docChanges().forEach((change) => {
//             const noteData = change.doc.data();

//             switch (change.type) {
//               case "added":
//                 // console.log(noteData,'added');
//                 // console.log(noteData);
//                 // addNoteToRealm(noteData);
//                 break;
//               case "modified":
//                 // console.log(noteData,'Updated');

//                 // updateNoteInRealm(noteData);
//                 break;
//               // case "removed":
//               //   deleteNoteFromRealm(noteData.id);
//               //   break;
//             }
//           });
//         });
//       return () => unsubscribe();
//     }
//   }, []);
// };

// export const useFetchAllNotesData = (
//   userId: string,
//   networkAvailable: boolean
// ) => {
//   useEffect(() => {
//     if (networkAvailable && userId) {
//       firestore()
//         .collection(FIREBASE_STRINGS.USER)
//         .doc(userId)
//         .collection(FIREBASE_STRINGS.NOTES)
//         .get()
//         .then((noteData) => {
//           const data = noteData.docs.map((doc) => ({
//             ...doc.data(),
//             _id: doc.id,
//           }));
//           // data.forEach((d) => console.log(d, "data"));
//         })
//         .catch((e) => console.log(e));
//     }
//   }, [networkAvailable, userId]);
// };

export const useFirestoreToRealmSync = (
  uid: string,
  realmInstance: Realm,
  isLoading: boolean,
  isNetworkAvalible: boolean
) => {
  useEffect(() => {
    if (!isLoading && isNetworkAvalible) {
      const unsubscribeNotes = firestore()
        .collection(FIREBASE_STRINGS.USER)
        .doc(uid)
        .collection(FIREBASE_STRINGS.NOTES)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            realmInstance.write(() => {
              console.log('snapshot');
              console.log(change.type,data.title);
                           
              if (change.type === "added" || change.type === "modified") {
                realmInstance.create(
                  "Note",
                  {
                    _id: change.doc.id,
                    title: data.title,
                    content: data.content,
                    label: data.label.id,
                    imagesURL: data.url,
                    timestamp: data.time_stamp
                      ? data.time_stamp.toDate()
                      : new Date(),
                    synced: true,
                    status: change.type,
                  },
                  UpdateMode.Modified
                );
              } else if (change.type === "removed") {
                const noteToDelete = realmInstance.objectForPrimaryKey(
                  "Note",
                  change.doc.id
                );
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
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            realmInstance.write(() => {
              if (change.type === "added" || change.type === "modified") {
                realmInstance.create(
                  "Label",
                  {
                    _id: change.doc.id,
                    label: data.label,
                    count: data.count,
                    timestamp: data.time_stamp
                      ? data.time_stamp.toDate()
                      : new Date(),
                    synced: true,
                    status: change.type,
                  },
                  UpdateMode.Modified
                );
              } else if (change.type === "removed") {
                const labelToDelete = realmInstance.objectForPrimaryKey(
                  "Label",
                  change.doc.id
                );
                if (labelToDelete) {
                  realmInstance.delete(labelToDelete);
                }
              }
            });
          });
        });
      return () => {
        
        // if(!isNetworkAvalible)       
          console.log('unsubscribe list');
        unsubscribeNotes();
        unsubscribeLabels();
      };
    }
  }, [uid, realmInstance, isNetworkAvalible]);
};

export const useLabelsById = (
  id: string,
  realm: Realm,
  setData: (key: Note[]) => void,
  isLoading: boolean
) => {
  useEffect(() => {
    if (!isLoading) {
      const notes = realm
        .objects<Note>("Note")
        .filtered("label == $0", id)
        .filtered("status != $0", REALM.STATUS.DELETE)
        .sorted("timestamp", true);
      const updateLabels = () => {
        setData([...notes]);
      };
      updateLabels();
      const labelsListener = () => {
        updateLabels();
      };
      notes.addListener(labelsListener);
      return () => {
        notes.removeListener(labelsListener);
      };
    }
  }, [realm,id]);
};

export function useRealmSync(
  realmInstance: Realm,
  uid: string,
  isConnected: boolean,
  isLogin:boolean,
) {

  useEffect(() => {
    if (!isConnected) return;
    if(!uid) return;
    const notes = realmInstance.objects("Note");
    const labels = realmInstance.objects("Label"); 
    const syncChanges = async () => {
      await syncRealmToFirestore(uid, realmInstance);
    };

    const notesObserver = notes.addListener(() => {
      syncChanges();
    });

    const labelsObserver = labels.addListener(() => {
      syncChanges();
    });

    return () => {
      notes.removeListener(notesObserver);
      labels.removeListener(labelsObserver);
    };
  }, [isConnected, realmInstance, uid,isLogin]);
}