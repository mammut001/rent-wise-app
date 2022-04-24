import { StyleSheet, Text, View } from "react-native";
import * as React from 'react';
import ListingScreen from "./TabViewWidgets/ListingWidget";
import { useEffect, useState } from "react";
import { HouseEntity, HouseType } from "@store/entity";
import { FIRE_STORE_HOUSE_COLLECTION } from "@firebase/firebase-auth";
import toast from "@components/toast";
import { useFocusEffect } from "@react-navigation/native";

function HouseCollectionScreen({ navigation, route }) {
  const item = route.params;
  let houseType = item.index == 0 ? HouseType.apartment : HouseType.house

  const [houseList, setHouseList] = useState<Array<HouseEntity>>([])


  const fetchList = async () => {
    toast.showLoading()
    let store_house_list_docs = (await FIRE_STORE_HOUSE_COLLECTION
      .where("type", "==", houseType)
      .get()).docs

    let store_house_list = store_house_list_docs.map(doc => doc.data())
    setHouseList(store_house_list)
    toast.hideLoading()

  }


  useEffect(() => {
    fetchList()
  }, [])

  // 
  // WHen jump to this screen, should pass a id parameter, should find the image in firebase and update it.
  // {title: 'Apartment', img: require('../assets/apartment.jpg')},
  // {title: 'House', img: require('../assets/house.jpg')},
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>
        {item.title}
      </Text>
      <ListingScreen navigation={navigation} houseList={houseList}
        onPress={index => {

        }}
      />
    </View>
  )
}
export default HouseCollectionScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})