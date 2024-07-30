import firestore from "@react-native-firebase/firestore";
import { useEffect } from "react";
import { FIREBASE_STRINGS } from "../../Constants/Strings";

export const useUpdateLabel = (
    uid: string,
    setData: (key: { labelName: string, labelId: string, count: number}[]) => void
) => {
    useEffect(() => {
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
    }, [setData, uid]);
};

export const useFetchUpdatedLabelData = (labelId: string,labelName:string, userId: string,setNotesData:any,setSearchData:any)=>{
    useEffect(()=>{
        const labelRef = firestore().collection(FIREBASE_STRINGS.USER).doc(userId).collection(FIREBASE_STRINGS.LABELS).doc(labelId);
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
              title: note.data().title,
              time_stamp: note.data().time_stamp,
              ImageUrl: note.data().url,
              id: userId,
              labelName
            };
          });
          
        setNotesData(notes);
        setSearchData(notes);
      });
    return () => unsubscribe();
    },[])
}