import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

const initialState = {
  theme: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('appTheme', state.theme);
    },
    loadTheme: (state, action) => {
      state.theme = action.payload;
    },
    changeApprearance:(state)=>{
      Appearance.setColorScheme('light')
    }
  },
});

export const { toggleTheme, loadTheme ,changeApprearance } = themeSlice.actions;

export const loadThemeFromStorage = () => async (dispatch: (arg0: { payload: any; type: "theme/loadTheme"; }) => void) => {
  const savedTheme = await AsyncStorage.getItem('appTheme');
  if (savedTheme) {
    dispatch(loadTheme(savedTheme));
  }
};

export default themeSlice.reducer;
