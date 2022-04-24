import { Text, StatusBar, SafeAreaView, ScrollView, View, TextInput, StyleSheet, Button, Alert } from "react-native";
import * as React from 'react';
import { useState, useEffect } from "react";
import { FireAuth, FIRE_STORE_USER_COLLECTION } from "@firebase/firebase-auth";
import toast from "@components/toast";
import LocalStorage from "@common/localStorage";
import ConstantsKey from "@common/constantsDefine";
import { UserEntity } from "@store/entity";
import { first } from "lodash";




function LoginScreen({ navigation }) {
  const [userEmail, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const signIn = async () => {

    if (userEmail.length == 0 || password.length == 0) {
      // toast.show({ message: "email or password is null" })
      return
    }

    toast.showLoading("Login...")
    try {

      let res = await FireAuth.signInWithEmailAndPassword(userEmail, password)
      console.log(res);

      toast.show({ message: "Login successfully" })

      toast.hideLoading()

      navigation.replace("App")
    } catch (error) {
      toast.hideLoading()

      toast.show({ message: error.message })

    } finally {
      toast.hideLoading()
      toast.hideLoading()


    }



  }
  const register_account = async () => {
    toast.showLoading("regist account ...")
    try {
      let res = await FireAuth.createUserWithEmailAndPassword(userEmail, password)
      toast.hideLoading()

      if (res) {
        let user_entity = new UserEntity()
        user_entity.email = userEmail
        user_entity.uid = res.user.uid

        let fire_store_res = await FIRE_STORE_USER_COLLECTION.add(user_entity)

        toast.show({ message: "regist account successfully" })

      }



    } catch (error) {

      toast.show({ message: error.message })
      toast.hideLoading()

    }


  }


  useEffect(() => {
    navigation.setOptions({ title: "Login" })

    //Check user login information and update user information and configuration
    const subscriber = FireAuth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("App")

        try {
          // check user_entity
          FIRE_STORE_USER_COLLECTION.where("uid", "==", user.uid).get().then(res => {
            if (res.empty) {
              return
            }
            let user_query = first(res.docs).data()
            let user_save = JSON.stringify(user_query)

            LocalStorage.setKeyValue(ConstantsKey.key_user_login, user_save)


          })


        } catch (error) {
          console.log(error);

        }



      }


    });

    return subscriber
  }, [])


  return (

    <View style={styles.container}>

      <TextInput
        style={styles.userEmail}
        placeholder={"User Email"}
        onChangeText={(text) => {
          setEmail(text)
        }}
        value={userEmail} />
      <TextInput
        style={styles.password}
        placeholder={"Password"}
        secureTextEntry={true}
        onChangeText={(text) => {
          setPassword(text)
        }}
        value={password} />
      <Button
        title={"Signin"}
        onPress={() => {
          signIn()
        }}
      />
      <Button
        title={"Signup"}
        onPress={() => {
          register_account()
        }}
      />

    </View>
  )
}


const styles = StyleSheet.create(({
  container: {
  },
  status: {
    color: '#111111',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userEmail: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,

    marginTop: 18,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  password: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,

    marginBottom: 20,
    marginTop: 18,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
  }
}))


export default LoginScreen