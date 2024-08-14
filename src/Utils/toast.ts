import Toast from "react-native-toast-message";

export function toastSuccess(text: string) {
    Toast.show({
        type: 'success',
        text1: text,
        visibilityTime:3000
    });
}
export function toastInfo(text: string) {
    Toast.show({
        type: 'info',
        text1: text,
        visibilityTime:3000
    });
}
export function toastError(text: string) {
    Toast.show({
        type: 'error',
        text1: text,
        visibilityTime:3000
    });
}