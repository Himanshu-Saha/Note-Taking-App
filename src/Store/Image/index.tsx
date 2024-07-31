import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { uploadPhoto } from '../../Utils/Images/image';

const image = createSlice({
  name: 'image',
  initialState: {
    imageUri: {},
    isConnected:false,
    queuedImage:{}
  },
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    loadImage: (state, action) => {
      const noteId = action.payload.noteId;
      const uri = action.payload.uri;
      const uid = action.payload.uid;
      const imageData:{[key:string]:string[]} = state.imageUri;
      if (state.imageUri.hasOwnProperty(noteId)) {
        imageData[noteId] = [...imageData[noteId], ...uri];
        state.imageUri = imageData;
      } else {
        imageData[noteId] = uri;
        state.imageUri = imageData;
        
      }
      // AsyncStorage.setItem('Saved_Images', JSON.stringify(state.imageUri));
      // uploadPhoto(uri,uid,noteId)
    },
    deleteImage: (state, action) => {},
    getFromAsyncStorage: (state, action) => {
      state.imageUri = action.payload ?? {};
    },
  },
});
export const {loadImage, getFromAsyncStorage,setConnectionStatus} = image.actions;

export default image.reducer;
