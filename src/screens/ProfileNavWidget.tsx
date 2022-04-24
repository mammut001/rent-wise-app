import ConstantsKey from "@common/constantsDefine";
import LocalStorage from "@common/localStorage";
import toast from "@components/toast";
import { FIRE_STORE_USER_COLLECTION, fetchUserFromRemote, FireAuth } from "@firebase/firebase-auth";
import { useFocusEffect } from "@react-navigation/native";
import * as React from "react";
import { useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View, useWindowDimensions, Button, } from "react-native";
import { Avatar, Caption, Title } from "react-native-paper";

function ProfileNavWidget({ navigation }) {

  const [name, setName] = React.useState("Rent-Wise")
  const [emailAddress, setEmailAddress] = React.useState("rent-wise@gmail.com")
  const [avatar, setAvatar] = useState("https://i.ibb.co/jVHCdf2/avatar.png")

  const fetchUser = async () => {
    let email = await LocalStorage.getUserEmail()
    setEmailAddress(email)
    let user = await fetchUserFromRemote()
    setName(user.display_name)
    setAvatar(user.avatar_url)

  }




  useFocusEffect(React.useCallback(() => {
    console.log('useFocusEffect---ProfileNavWidget-->');

    fetchUser()
  }, []))


  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title={"Update Your Profile"}
            onPress={() => {
              navigation.push("Profile Edit")
            }}
          // updateProfile does not need to push to database, only local change is enough
          />

          <Button title={"Logout"}
            onPress={async () => {
              toast.showLoading("Logout ...")
              await LocalStorage.removeAllData()
              await FireAuth.signOut()
              toast.hideLoading()
              navigation.replace("Login")
            }}
          // click button to go to login intent, login success, go back to this view, update name and avatar
          // only update name, email, avatar, success, go back to this view
          />
        </View>

        <View style={{ flexDirection: "column", marginTop: 30 }}>

          <Avatar.Image
            style={styles.avatar}
            source={{ uri: avatar }}
            size={130} />
          <View>
            <Title style={styles.title}>{name}</Title>
            <Caption style={styles.caption}>{emailAddress}</Caption>



          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    // marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
    alignSelf: 'center'
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    justifyContent: 'center',
    alignSelf: 'center'
  },
  container1: {
    marginTop: 0
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  review: {
    flexDirection: 'row'
  },


});
export default ProfileNavWidget
