import { createSlice } from "@reduxjs/toolkit";
import { User as FirebaseUser } from "@firebase/auth-types";

interface CommonState {
    user: FirebaseUser|null;
    providerId: string | null;
    isLogedIn: boolean;
    userProfileURL: string | null;
}

const initialState: CommonState = {
    user: null,
    providerId: null,
    isLogedIn: false,
    userProfileURL: null,
};

const common = createSlice({
    name: 'common',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload;
        },
        updateLogIn: (state, action) => {
            state.isLogedIn = action.payload;
        },
        updateProvider: (state, action) => {
            state.providerId = action.payload
        },
        updateUserProfileURL: (state, action) => {
            state.userProfileURL = action.payload
        }
    }
})

export const { updateUser, updateLogIn, updateProvider, updateUserProfileURL } = common.actions;

export default common.reducer;