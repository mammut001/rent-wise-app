import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import ApartmentIcon from "react-native-vector-icons/MaterialIcons";
import * as React from "react";
import { HouseEntity } from "@store/entity";
import { FIRE_STORE_HOUSE_COLLECTION } from "@firebase/firebase-auth";
import { first } from "lodash";



/**
 * Declare the props of ListHouse
 */
export interface ListHouseProps {
  onPress?: (index: number) => void
  houseList: Array<HouseEntity>
  navigation?: any
  style?: ViewStyle
}


function ListingWidget(props: ListHouseProps) {
  const { onPress, houseList, navigation } = props
  // This is the data of the listingScreen, it should be read from firebase every time when the user adds a new listing, and refresh the list according to the category
  // Every item in the flatlist should be clickable, and it should navigate to the house details page

  const goDetail = async (index: number) => {
    let house = houseList[index]
    let house_id = house?.doc_id

    // If the house id is empty or null, then get the house id from firestore according to the address
    // Ensure that the house id is not empty or null
    if (house_id == null || undefined == house_id) {
      let house_remote_doc = first((await FIRE_STORE_HOUSE_COLLECTION.where("address", "==", house.address).get()).docs)
      house_id = house_remote_doc.id
    }

    console.log(navigation);

    navigation.navigate("HouseDetails", { id: house_id })

  }
  return (
    <FlatList
      style={[styles.container, props.style]}
      keyExtractor={(item, index) => index.toString()}

      data={houseList}
      renderItem={({ item, index }) =>
        <Pressable style={styles.review}
          onPress={() => {
            onPress && onPress(index)
            goDetail(index)
          }}
        >
          <ApartmentIcon name="apartment" size={30} color="#000000" />
          <Text style={styles.item}>{item.address}</Text>
        </Pressable>
      }
    />
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
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

export default ListingWidget
