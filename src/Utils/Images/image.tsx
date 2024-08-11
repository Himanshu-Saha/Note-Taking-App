import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Alert } from 'react-native';
import { STRINGS } from '../../Constants/Strings';

export const uploadPhoto = async(photo:string,uid:string,noteId:string) => {
    try {
        if(!photo.length)
            return
        
        let photoUrls = [];
        for (const item of photo) {
            const photoName = item.split('/').pop();
            const folder = `${uid}/${noteId}/${photoName}`;
            const reference = storage().ref(folder);
            await reference.putFile(item);
            const url = await reference.getDownloadURL();
            photoUrls.push(url);
          }
        const ImageUrls = await firestore()
        .collection(STRINGS.FIREBASE.USER)
        .doc(uid)
        .collection(STRINGS.FIREBASE.NOTES)
        .doc(noteId)
        .get()
        photoUrls = [...(ImageUrls.data()?.url),...photoUrls]

        await firestore()
        .collection(STRINGS.FIREBASE.USER)
        .doc(uid)
        .collection(STRINGS.FIREBASE.NOTES)
        .doc(noteId)
        .update({
            url: photoUrls
          });
          // console.log('All image uploaded to firebase');
          
    } catch (e:unknown) {
        if(e instanceof Error){
            Alert.alert(STRINGS.PHOTO_UPLOAD_FAILED , e.message);
        }else{
            Alert.alert(STRINGS.UNKNOWN_ERROR);
        }
    }
}