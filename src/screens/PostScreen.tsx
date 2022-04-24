import { Alert, Button, Dimensions, StyleSheet, Text, TextInput, View, ScrollView, DeviceEventEmitter } from "react-native";
import { Picker } from '@react-native-picker/picker';

import Icon from "react-native-vector-icons/FontAwesome";
import { Avatar } from "react-native-paper";
import * as React from "react";
import { useState, useEffect } from "react";
const { width } = Dimensions.get('screen');
import StarRating from 'react-native-star-rating';
import toast from "@components/toast";
import ImagePicker from 'react-native-image-crop-picker';
import { Pressable } from "react-native";
import { Image } from "react-native";
import { HouseEntity, RateEntiry } from "@store/entity";
import LocalStorage from "@common/localStorage";
import { FIRE_STORE_HOUSE_COLLECTION, FIRE_STORE_RATE_COLLECTION, upload_file_to_firestorage } from "@firebase/firebase-auth";
import { first } from "lodash";
import ConstantsKey, { NotificationKeys } from "@common/constantsDefine";



function PostScreen({ navigation }) {

  /**
   * Initializes states of comment, address, city, postalCode and rating
   *
   * @param {string?} n/a
   * @param {string?} n/a
   * @returns n/a
   */
  //Initial state should be null or empty, but I changed it to this to facilitate testing
  const [title, setTitle] = useState({ val: "" })
  const [address, setAddress] = useState({ val: "" })
  const [city, setCity] = useState({ val: "" })
  const [postalCode, setPostalCode] = useState({ val: "" })
  const [rating, setRating] = useState({ val: 3 })

  const [image_select, setImage_select] = useState(null)

  //drop down
  const [houseType, setHouseType] = useState("apartment")

  /**
   * reset states of 5 states above, and it will clear the input text field after submit button was clicked
   *
   * @param {string?} n/a
   * @param {string?} n/a
   * @returns n/a
   */
  const resetState = () => {
    setTitle({ val: "" })
    setAddress({ val: "" })
    setCity({ val: "" })
    setPostalCode({ val: "" })
    setRating({ val: 3 })
    setImage_select(null)
  }
  /**
   * validate 5 input text fields after user clicked submit button.
   *
   * @param {string?} n/a
   * @param {string?} n/a
   * @returns *[] arraylist of text fields that failed validation test
   */
  const validateInput = () => {

    // This validate method is temporary
    // TODO: validate the input fields
    if (title.val.length == 0) {

      toast.show({ message: "comment is empty" })
      return false

    }
    if (address.val.length == 0) {
      toast.show({ message: "address is empty" })

      return false

    }
    if (city.val.length == 0) {
      toast.show({ message: "city is empty" })

      return false


    }
    if (postalCode.val.length == 0) {
      toast.show({ message: "postalCode is empty" })

      return false

    }

    return true

  }

  const [source, setSource] = useState(null)

  useEffect(() => {
    resetState()
  }, [])



  const chooseFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true
    }).then(response => {
      console.log(response.path);
      setImage_select(response.path)
      let { data } = response as any
      const source = { uri: 'data:image/jpeg;base64,' + data };
      setSource(source)

    });
  }
  const submitPost = async () => {
    let user_mail = await LocalStorage.getUserEmail()



    let downloadUrl = null
    if (image_select) {
      downloadUrl = await upload_file_to_firestorage(image_select)
    }


    toast.showLoading("Submit ...")

    // Fetch data from firestore, or add new data to firestore
    let address_query_snapshots = await FIRE_STORE_HOUSE_COLLECTION
      .where("address", "==", address)
      .where("city", "==", city)
      .where("post_code", "==", postalCode)
      .get()
    let house_id = null
    if (address_query_snapshots.empty) {// if there is no house with the same address, create a new house

      let house_entity = new HouseEntity()
      house_entity.address = address.val
      house_entity.city = city.val
      house_entity.post_code = postalCode.val
      house_entity.type = houseType as any
      house_entity.cover = downloadUrl

      let add_res = await FIRE_STORE_HOUSE_COLLECTION.add(house_entity)
      console.log("add house address successfully --->", add_res)
      house_id = add_res.id


    }
    else {// if there is a house with the same address, get the house id
      let house_exist = first(address_query_snapshots.docs).id
      house_id = house_exist

    }


    let user_id = await LocalStorage.getUser_id()
    let user_email = await LocalStorage.getUserEmail()



    let rate_entity = new RateEntiry()
    rate_entity.content = title.val
    rate_entity.score = rating.val
    rate_entity.user_id = user_id
    rate_entity.house_id = house_id
    rate_entity.email = user_email

    let res_rate = await FIRE_STORE_RATE_COLLECTION.add(rate_entity)
    toast.hideLoading()

    toast.show({ message: "submit successfully" })
    resetState()

    DeviceEventEmitter.emit(NotificationKeys.POST_SUCCESS)



  }

  return (
    <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
      <Picker
        mode="dropdown"
        selectedValue={houseType}
        onValueChange={(itemValue, itemIndex) => {
          setHouseType(itemValue)
        }
        }>
        <Picker.Item label="Apartment" value="apartment" />
        <Picker.Item label="House" value="house" />
      </Picker>

      <Pressable onPress={chooseFromLibrary}>
        {
          source != null ?
            <Image style={[{ width: 80, height: 80, margin: 15, borderRadius: 10 }, styles.imagePicker]} source={source}></Image>
            :
            <Icon style={styles.imagePicker} name={"image"} size={45} color={'blue'} />

        }
      </Pressable>
      <Text style={styles.infoText}>Choose a image as cover image.</Text>

      <Text style={styles.text}>
        Your Review:
      </Text>
      <TextInput
        multiline={true}
        value={title.val}
        style={styles.reviewField}
        onChangeText={(text) => {
          //setComment(val)
          setTitle({ val: text })
        }}
        placeholder={'Please text your comments here!'}
        accessibilityLabel="This is an input text field that will ask user to enter the comments or feelings of the house he or she lived before.">
      </TextInput>
      <Text style={styles.text}>
        Your Address:
      </Text>
      <TextInput
        multiline={true}
        value={address.val}
        style={styles.addressField}
        onChangeText={(text) => {
          setAddress({ val: text })

        }}
        placeholder={'Please enter address here! (eg. 123 Parker Drive)'}
        accessibilityLabel="This is an input text field that will ask user to input the address">
      </TextInput>
      <TextInput
        multiline={true}
        value={city.val}
        style={styles.addressField}
        onChangeText={(text) => {
          setCity({ val: text })
        }}
        placeholder={'Please enter city here! (eg. Toronto)'}
        accessibilityLabel="This is an input text field that will ask user to input the city">
      </TextInput>
      <TextInput
        multiline={true}
        value={postalCode.val}
        style={styles.addressField}
        onChangeText={(text) => {
          setPostalCode({ val: text })
        }}
        placeholder={'Please enter postal code here. (eg A1E3D2)'}
        accessibilityLabel="This is an input text field that will ask user to input the postal code">
      </TextInput>
      <Text style={styles.text}>
        Your Rating:
      </Text>
      <View
        style={{

          paddingLeft: 20,
          marginVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          justifyContent: "flex-start"
        }}
      >
        <StarRating
          disabled={false}
          maxStars={5}
          rating={rating.val}
          selectedStar={(rating) => {
            setRating({ val: rating })
          }}
        />
      </View>

      <Button
        onPress={async () => {
          let result = validateInput()
          if (!result) {
            console.log("INVALID INPUT");

            return
          }

          submitPost()

        }}
        title="Submit!"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignSelf: 'center'
  },
  text: {
    marginLeft: 20,
    marginTop: 15,
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 20,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  reviewField: {
    maxHeight: 300,
    backgroundColor: '#ffffff',
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
    marginLeft: 20,
    color: "black"
  },

  addressField: {
    marginTop: 10,
    height: 45,
    backgroundColor: '#ffffff',
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
    marginLeft: 20,
    color: "black"

  },
  rating: {
    color: "black",
    marginTop: 10,
    height: 45,
    backgroundColor: '#ffffff',
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
    marginLeft: 20
  },
  hint: {
    color: "#ccc",
    fontSize: 15,
    fontWeight: "bold"
  },
  imagePicker: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  infoText: {
    color: '#111111',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center'
  },

});

export default PostScreen
