import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import common from "./Common";
import firebase from "./Firebase";
import image from './Image';
import loader from "./Loader";
import network from "./Network";
import theme from "./Theme";
export const store = configureStore({
    reducer:{
        common,
        firebase,
        theme,
        image,
        network,
        loader
    },
    middleware: getDefaultMiddleware=>getDefaultMiddleware()
})
	
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()