import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { AppDispatch } from "../../Store";
import { updateNetwork } from "../../Store/Network";

export function useNetworkAvailable(dispatch: AppDispatch) {
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            dispatch(updateNetwork(state.isConnected))
        });
        return () => {
            unsubscribe();
        };
    }, [dispatch]);
}