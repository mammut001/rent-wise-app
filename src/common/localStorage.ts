import AsyncStorage from '@react-native-community/async-storage';
import ConstantsKey from './constantsDefine';


const APP_STATE_LOCALSTORAGEY_KEY = {
    APP_PROTOCOL_AGGREE_KEY: "APP_PROTOCOL_AGGREE_KEY",


}
export {
    APP_STATE_LOCALSTORAGEY_KEY
}


/**
 * Encapsulate local storage class
 */
export default class LocalStorage {

    /**
     * Save key - value -value if the value is object, must be converted to jsonstring
     * @param key
     * @param value
     * @returns {Promise<unknown>}
     */
    static setKeyValue = async (key = '', value = '') => {

        if (key == null) return Promise.reject("key is null");

        let promise = new Promise((resolve, reject) => {
            AsyncStorage.setItem(key, value, function (error) {
                if (error == null) {
                    resolve(true);
                }
                reject(error)
            })
        })
        return promise;


    }


    /**
     * Fetches the value for the given key
     * @param key
     * @returns {Promise<unknown>}
     */
    static getValue = async (key = '') => {
        if (key == null) return Promise.reject("key is null");

        let promise = new Promise<string>((resolve, reject) => {

            AsyncStorage.getItem(key, function (error, result) {
                if (error !== null) {
                    resolve(JSON.parse(result))

                }
                if (result == undefined && result == null) {
                    reject(error);
                }
                resolve(result);
            })


        })
        return promise;


    }
    /**
     * Delete data from local storage based on Key
     * @param key
     * @returns {Promise<R>}
     */
    static removeKey = async (key = '') => {
        let promise = new Promise((resolve, reject) => {

            if (key == null) reject("key is null");
            AsyncStorage.removeItem(key, function (error) {
                if (error != null) {
                    reject(error);
                }
                resolve(true);
            })

        })
        return promise;


    }

    /**
     * Delete Entire local storage
     */
    static async removeAllData() {

        let allKeys = await AsyncStorage.getAllKeys()
        allKeys.forEach(key => {
            if (Object.keys(APP_STATE_LOCALSTORAGEY_KEY).indexOf(key) < 0) {
                AsyncStorage.removeItem(key)
            }
        })
    }


    /**
     * Fetch the phone number from local storage
     * @returns 
     */
    static getUserEmail = async () => {
        try {
            let userJson = await LocalStorage.getValue(ConstantsKey.key_user_login)
            let user_update = JSON.parse(userJson)
            return user_update.email
        } catch (error) {
            return null
        }

    }
    /**
     * Fetch user_id from local storage 
     * @returns 
     */
    static getUser_id = async () => {
        try {
            let userJson = await LocalStorage.getValue(ConstantsKey.key_user_login)
            let user_update = JSON.parse(userJson)
            return user_update.uid
        } catch (error) {
            return null
        }
    }


}
