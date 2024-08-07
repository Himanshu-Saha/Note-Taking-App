import { Store, configureStore } from "@reduxjs/toolkit";
import image from './Image';
import common from "./Common";
import firebase from "./Firebase";
import theme from "./Theme";
import network from "./Network";
import { useDispatch, useSelector } from "react-redux";
export const store = configureStore({
    reducer:{
        common,
        firebase,
        theme,
        image,
        network,
    },
    middleware: getDefaultMiddleware=>getDefaultMiddleware()
})
	
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()