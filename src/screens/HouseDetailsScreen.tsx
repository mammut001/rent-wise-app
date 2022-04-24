import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import * as React from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import RateIcon from "react-native-vector-icons/MaterialIcons"
import { Caption, Title } from "react-native-paper";
import { useEffect, useState } from "react";
import { HouseEntity, RateEntiry, UserHouseLikeEntity, UserHouseViews } from "@store/entity";
import { FIRE_STORE_HOUSE_USER_LIKE_COLLECTION, FIRE_STORE_HOUSE_USER_VIEWS_COLLECTION, FIRE_STORE_RATE_COLLECTION } from "@firebase/firebase-auth";
import LocalStorage from "@common/localStorage";
import ConstantsKey from "@common/constantsDefine";
import { first } from "lodash";
import toast from "@components/toast";
import { fetchHouseDetail } from "@firebase/firebase-house";
import { useFocusEffect } from "@react-navigation/native";


//TODO Add this item to liked list after clicking like, and button color changed
//TODO When User Clicked AddReviews, app should jump to the post intent with params passed in.
function HouseDetailsScreen({ navigation, route }) {
  const house_id = route.params.id

  const [liked, setLiked] = useState(false);
  const [house, setHouse] = useState<HouseEntity>(null)

  const [rateList, setRateList] = useState<Array<RateEntiry>>([])



  /**
   * Fetch whether the user has liked the house
   */
  const fetchData = async () => {
    let user_id = await LocalStorage.getUser_id()

    let store_house_like_docs = (await FIRE_STORE_HOUSE_USER_LIKE_COLLECTION
      .where("user_id", "==", user_id)
      .where("house_id", "==", house_id)
      .get()).docs


    let house_detail = await fetchHouseDetail(house_id)
    setHouse(house_detail)



    setLiked(store_house_like_docs.length > 0)


    /**
     * Fetch the comment list
     */
    let store_house_rate_docs = (await FIRE_STORE_RATE_COLLECTION.where("house_id", "==", house_id).get()).docs
    let _rateList = store_house_rate_docs.map(doc => {
      return doc.data()
    })
    setRateList(_rateList)



  }

  /**
   * Add a record
   */
  const addHouseToViewHistory = async () => {
    let user_id = await LocalStorage.getUser_id()
    console.log(house, '----house');
    if (null == house) {
      return
    }

    let doc = await FIRE_STORE_HOUSE_USER_VIEWS_COLLECTION.where("house_id", "==", house.doc_id)
      .where("user_id", "==", user_id).get()
    if (doc.empty) {
      //Add a record
      let record = new UserHouseViews()
      record.house_id = house.doc_id
      record.user_id = user_id

      let res_add = await FIRE_STORE_HOUSE_USER_VIEWS_COLLECTION.add(record)
      console.log("UserHouseViews--add--success---", res_add.id);


    }
  }


  const addLike = async () => {
    toast.showLoading("add house like")
    let user_id = await LocalStorage.getUser_id()
    let like_entity = new UserHouseLikeEntity()
    like_entity.house_id = house.doc_id
    like_entity.user_id = user_id
    let doc = await FIRE_STORE_HOUSE_USER_LIKE_COLLECTION.add(like_entity)
    console.log("add UserHouseLikeEntity success--->", doc.id);
    setLiked(true)
    toast.hideLoading()



  }
  const disLike = async () => {
    toast.showLoading("cancel house like")


    let user_id = await LocalStorage.getUser_id()
    let house_id = house.doc_id

    let store_house_like_docs = (await FIRE_STORE_HOUSE_USER_LIKE_COLLECTION
      .where("user_id", "==", user_id)
      .where("house_id", "==", house_id)
      .get()).docs



    store_house_like_docs.forEach(async (doc, index) => {
      await FIRE_STORE_HOUSE_USER_LIKE_COLLECTION.doc(doc.id).delete()
      console.log("documents deleted ->", doc.id)
      if (index == store_house_like_docs.length - 1) {
        setLiked(false)
        toast.hideLoading()
      }
    })


  }

  useFocusEffect(React.useCallback(() => {
    fetchData()
  }, []))

  useEffect(() => {
    addHouseToViewHistory()
  }, [house])



  const renderReviewCell = (rate: RateEntiry, index: number) => {
    return (
      <View
        key={index.toString()}
        style={{
          paddingBottom: 15,
        }}>
        <Text>User: {rate.email}</Text>
        <Text>Score: {rate.score}</Text>
        <Text>Content: {rate.content}</Text>

        {
          index < rateList.length - 1 ?
            <View style={{ backgroundColor: "#ccc", height: 1, width: "100%", marginTop: 10 }} /> : null
        }

      </View>
    )

  }


  if (house == null) {

    return (
      <ActivityIndicator color="blue" size={"large"}></ActivityIndicator>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <ImageBackground source={{ uri: house.cover }} style={styles.image}>
            <View style={styles.imageHeader}>
              <Pressable onPress={async () => {
                liked ? await disLike() : await addLike()

                Alert.alert(`You just ${liked ? 'disliked' : 'liked'} this item!`)
              }}
              //update like here.
              >
                <Icon name={'md-heart'}
                  color={liked ? 'red' : 'black'}
                  size={65} />
              </Pressable>

            </View>
          </ImageBackground>
        </View>
        <View style={styles.detailsContainer}>
          <Title >{house.address}</Title>
          <Caption>{house.city}</Caption>
          <RateIcon name={"rate-review"} color={'black'} size={30} />
          <Text>
            Avg Rating {house.avg_rate_score}
          </Text>

          {/* <Button
            title="Add Reviews"
            color='#007AFF'
            onPress={() => Alert.alert('You show now be able to add reviews')}
          /> */}

          <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 15, alignSelf: "center" }}>Review List</Text>
          {
            rateList.length > 0 ?
              rateList.map(renderReviewCell) :
              <Text style={{}}>
                No rate for now
              </Text>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default HouseDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'

  },
  imageContainer: {
    marginTop: 20,
    elevation: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    height: 280,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 20,
    overflow: 'hidden',
    height: '100%',
    width: '100%'
  },
  imageHeader: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },




});
