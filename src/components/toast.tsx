import Toast from 'react-native-toast-hybrid';
import RootSiblings from 'react-native-root-siblings'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';


Toast.config({
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // tintColor: '#FFFFFF',
    cornerRadius: 5, // only for android
    duration: 1000,
    // graceTime: 300,
    // minShowTime: 500,
    // dimAmount: 0.0, // only for andriod
    loadingText: 'Loading...',
})


export interface ToastOptions {
    message: string,
    duration?: number,
    position?: number,
    shadow?: boolean,
    animation?: boolean,
    hideOnPress?: boolean,
    delay?: number,
    onShow?: Function,
    onShown?: Function,
    onHide?: Function,
    onHidden?: Function
}

/**
 *
 * @param {*} obj
 *      message,  string        Content of the toast
 *      duration, number(ms)    Display duration, default is 2000ms
 *      position, number        Position of the toast, default is bottom
 *      shadow,   boolean       Whether to show the shadow, default is true
 *      animation, boolean      Whether to show the animation, default is true
 *      hideOnPress, boolean    Whether to hide the toast when the user taps it, default is true
 *      delay,      Number      Delay time to show the toast, default is 0
 *      onShow,     Function    Callback function when the toast is displayed
 *      onShown,    Function    Callback function when the toast is displayed
 *      onHide,     Function    Callback function when the toast is hidden
 *      onHidden    Function    Callback function when the toast is hidden
 */
const show = (obj: ToastOptions) => {
    const { message, duration, position, shadow, animation, hideOnPress, delay, onShow, onShown, onHide, onHidden } = obj
    let showTime = duration || 1500;
    Toast.config({
        // backgroundColor: '#BB000000',
        // tintColor: '#FFFFFF',
        // cornerRadius: 5, // only for android
        // duration: 2000,
        // graceTime: 300,
        // minShowTime: 500,
        // dimAmount: 0.0, // only for andriod
        loadingText: 'Loading...',
    })

    Toast.text(message, duration)

    // navigationService.showOverlay(OtherComponents.ToastOverlay.name, null, { message: message, duration: duration,position:position })





}

let sibling = undefined;


/**
 * Display a loading toast
 * @param message
 */
function showLoading(message = "Loading...") {

    sibling = new RootSiblings(
        <View style={styles.maskStyle}>
            <View style={styles.backViewStyle}>
                <ActivityIndicator size="large" color="white" />
                <Text style={{ fontSize: 15, color: "white", marginTop: 10 }}>{message}</Text>
            </View>
        </View>
    )
}

/**
 * Hide the loading toast
 */
function hideLoading() {
    if (sibling instanceof RootSiblings) {
        sibling.destroy()
        sibling.destroy()
    }

}





export default { show, showLoading, hideLoading };


const styles = StyleSheet.create({
    maskStyle: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // width: AppShareGlobal.deviceInfo.width,
        // height: AppShareGlobal.deviceInfo.height,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backViewStyle: {
        backgroundColor: '#111',
        width: 120,
        height: 100,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 5
    }
}
)
