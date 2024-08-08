import { createSlice } from '@reduxjs/toolkit';

const image = createSlice({
  name: 'image',
  initialState: {
    imageUri: {},
    queuedImage:{}
  },
  reducers: {
    loadImage: (state, action) => {
      const noteId = action.payload.noteId;
      const url = action.payload.url;
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
    // deleteImage: (state, action) => {},
    getFromAsyncStorage: (state, action) => {
      state.imageUri = action.payload ?? [];
    },
  },
});
export const {loadImage, getFromAsyncStorage} = image.actions;

export default image.reducer;
