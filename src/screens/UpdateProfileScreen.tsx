/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {
    Text,
    StatusBar,
    SafeAreaView,
    ScrollView,
    View,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    Pressable,
    Dimensions,
    Image
} from "react-native";
import * as React from 'react';
import { useEffect, useState } from "react";
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome'
import { fetchUserFromRemote, FIRE_STORE_USER_COLLECTION, updateUserToRemote, upload_file_to_firestorage } from "@firebase/firebase-auth";
import LocalStorage from "@common/localStorage";
import { first } from "lodash";
import toast from "@components/toast";
const width = Dimensions.get('window').width
function UpdateProfileScreen({ navigation }) {
    const [isPasswordChanged, setPasswordStatus] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [source, setSource] = useState(null)
    const [image_select, setImage_select] = useState(null)

    // validate email
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const chooseFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true
        }).then(response => {
            setImage_select(response.path)
            console.log('image_path---->', image_select);
            let { data } = response as any
            const source = { uri: 'data:image/jpeg;base64,' + data };
            setSource(source)

        });
    }

    const getUser = async () => {
        let user = await fetchUserFromRemote()
        setName(user.display_name)
        if (user.avatar_url?.length > 0) {
            setImage_select(user.avatar_url)
            setSource({ uri: user.avatar_url })
        }



    }

    useEffect(() => {
        getUser()
    }, [])


    /**
     * Submit, update user to firestore
     */
    const submitUpdate = async () => {
        let downloadUrl = null
        if (image_select) {
            downloadUrl = await upload_file_to_firestorage(image_select)
        }
        let user_id = await LocalStorage.getUser_id()
        toast.showLoading("Updating...")
        await updateUserToRemote({ display_name: name, avatar_url: downloadUrl })
        toast.show({ message: "successfully" })
        toast.hideLoading()
        navigation.pop()



    }

    return (
        <View style={styles.container}>
            <Text style={styles.status}>
                {isPasswordChanged ? "You email and name were changed!" : "Not Updated"}
            </Text>
            <Pressable onPress={chooseFromLibrary}>
                {
                    source != null ?
                        <Image style={[{ width: 80, height: 80, margin: 15, borderRadius: 10 }, styles.imagePicker]} source={source}></Image>
                        :
                        <Icon style={styles.imagePicker} name={"image"} size={45} color={'blue'} />

                }
            </Pressable>
            <Text style={styles.infoText}>Click Image Icon Above to select your image.</Text>

            <TextInput
                style={styles.userName}
                placeholder={"Username"}
                onChangeText={(text) => {
                    setName(text)
                }}
                value={name} />
            {/* <TextInput
                style={styles.password}
                placeholder={"Email"}
                secureTextEntry={false}
                onChangeText={(text) => {
                    setEmail(text)
                }}
                value={email} /> */}
            <Button

                title={"Update Your Profile"}
                onPress={() => {
                    let errorMessage = []
                    let validationCheck = validateEmail(email)
                    //First to check if they are null
                    if (name?.length === 0) {
                        Alert.alert("Warning! ", "Username" + " is empty and email format is incorrect")
                        return

                    }


                    submitUpdate()

                }}
            />
        </View >
    )
}

const styles = StyleSheet.create(({
    container: {
        paddingVertical: 15,
    },
    imagePicker: {
        alignSelf: 'center',
        justifyContent: 'center'
    },
    status: {
        color: '#111111',
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    userName: {
        padding: 10,
        borderRadius: 3,
        marginTop: 18,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    password: {
        padding: 10,
        borderRadius: 3,
        marginBottom: 20,
        marginTop: 18,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    infoText: {
        color: '#111111',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignSelf: 'center'
    },

}))

export default UpdateProfileScreen;
