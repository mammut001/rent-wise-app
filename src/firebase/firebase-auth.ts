import auth from "@react-native-firebase/auth";
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import DateUtils from "@common/dateUtils";
import { first, last } from "lodash";
import LocalStorage from "@common/localStorage";
import toast from "@components/toast";
import {
  HouseEntity,
  RateEntiry,
  UserEntity,
  UserHouseLikeEntity,
  UserHouseViews,
} from "@store/entity";
import { Platform } from "react-native";

/**
 * This const variable is a Firebase Key for IOS device
 */
const credentials_ios = {
  clientId:
    "445424652962-tupd11o34fcmj0rpvjpk9e35il79nc7d.apps.googleusercontent.com",
  appId: "1:445424652962:ios:43f15023f3058f9e793dfb",
  apiKey: "AIzaSyCJ0y2OEZ_JY7YBFZmXrJo8aO6s2TFGUaY",
  databaseURL: "",
  storageBucket: "rent-wise-4eaf7.appspot.com",
  messagingSenderId: "",
  projectId: "rent-wise-4eaf7",
};
/**
 * This const variable is a Firebase for Android device
 */
const credentials_android = {
  clientId:
    "445424652962-sdva3sv02520c3kp1epaq0259gjq4719.apps.googleusercontent.com",
  appId: "1:445424652962:android:56c78b909eae5d78793dfb",
  apiKey: "AIzaSyCVE-An-KxL_6y4OfYRn7_xSXhKCt9sUEw",
  databaseURL: "",
  storageBucket: "gs://rent-wise-4eaf7.appspot.com",
  messagingSenderId: "",
  projectId: "rent-wise-4eaf7",
};

/**
 * Must be initialized in the app entry
 */

/**
 * This Async Function must be called when loading the data from Firebase
 * @constructor
 */
export const FIRE_APP_INITIAL = async () => {
  console.log(
    Platform.OS === "android"
      ? "Android Device Launched"
      : "IOS Device Launched"
  );
  if (!firebase.apps.length) {
    // firebase.initializeApp(credentials_ios, { name: "rent-wise-4eaf7" })
    firebase.initializeApp(
      Platform.OS === "ios" ? credentials_android : credentials_ios,
      { name: "rent-wise-4eaf7" }
    );
  } else {
    // If there is already a firebase database existed,
    // then we will just use existed DB.
    firebase.app();
  }
};

//firebase app instance
export const FireAuth = auth();

/**
 * firestore user reference
 */
export const FIRE_STORE_USER_COLLECTION =
  firestore().collection<UserEntity>("User");

/**
 * firestore comment reference
 */
export const FIRE_STORE_RATE_COLLECTION =
  firestore().collection<RateEntiry>("Rate");
/**
 * firestore house reference
 */
export const FIRE_STORE_HOUSE_COLLECTION =
  firestore().collection<HouseEntity>("House");

/**
 * UserHouseLikeEntity reference
 */
export const FIRE_STORE_HOUSE_USER_LIKE_COLLECTION =
  firestore().collection<UserHouseLikeEntity>("UserHouseLike");

/**
 * UserHouseViews reference
 */
export const FIRE_STORE_HOUSE_USER_VIEWS_COLLECTION =
  firestore().collection<UserHouseViews>("UserHouseViews");

/**
 * Upload image to firebase storage
 * @param file_path
 * @returns
 */
export const upload_file_to_firestorage = async (file_path = "") => {
  let name = last(file_path.split("/"));
  let user = await LocalStorage.getUserEmail();
  let ramdom_name = `${DateUtils.getCurrentTimeStamp()}_${user}_${name}`;

  const reference = storage().ref(name);
  toast.showLoading("uploading...");
  try {
    let res = await reference.putFile(file_path);
    toast.hideLoading();

    const url = await reference.getDownloadURL();
    return url;
  } catch (error) {
    toast.hideLoading();

    return null;
  }
};

/**
 * Fetches the user from the database
 * @returns
 */
export const fetchUserFromRemote = async () => {
  try {
    let user_id = await LocalStorage.getUser_id();
    let user_doc_snap = await FIRE_STORE_USER_COLLECTION.where(
      "uid",
      "==",
      user_id
    ).get();
    if (user_doc_snap.empty) {
      return null;
    }
    let user = first(user_doc_snap.docs).data();
    return user;
  } catch (error) {
    return null;
  }
};
/**
 * Update user information,set the user information to the database
 * @param user
 */
export const updateUserToRemote = async (user: Partial<UserEntity>) => {
  let user_id = await LocalStorage.getUser_id();
  let user_doc_snap = await FIRE_STORE_USER_COLLECTION.where(
    "uid",
    "==",
    user_id
  ).get();
  let user_doc_id = first(user_doc_snap.docs).id;
  await FIRE_STORE_USER_COLLECTION.doc(user_doc_id).update(user);
  console.log("FIRE_STORE_USER_COLLECTION---update-successfully");
};
