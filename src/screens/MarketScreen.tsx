import {
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  View,
  useWindowDimensions,
  TextInput,
  ScrollView,
  Image,
  Button,
  Dimensions,
  Pressable,
  FlatList, Alert, DeviceEventEmitter,
} from "react-native";
import * as React from 'react';
import { Avatar, Caption, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { FIRE_STORE_HOUSE_COLLECTION, FIRE_STORE_HOUSE_USER_LIKE_COLLECTION, FIRE_STORE_RATE_COLLECTION } from "@firebase/firebase-auth";
import { HouseEntity } from "@store/entity";
import toast from "@components/toast";
import { NotificationKeys } from "@common/constantsDefine";
const { width } = Dimensions.get('screen');


function MarketScreen({ navigation }) {

  const [houseList, sethouseList] = useState<Array<HouseEntity>>([])
  let searchContent = null


  // Check the list of houses entities
  const fetchHouseList = async (showLoading = true) => {
    //toast async thread bug add a parameter to control whether to show loading hud
    if (showLoading) {
      toast.showLoading()
    }
    /**
     * All houses data
     */
    let store_house_list_docs = (await FIRE_STORE_HOUSE_COLLECTION.get()).docs
    /**
     * All likes data
     */
    let store_house_like_docs = (await FIRE_STORE_HOUSE_USER_LIKE_COLLECTION.get()).docs
    /**
     * All comments data
     */
    let store_house_rate_docs = (await FIRE_STORE_RATE_COLLECTION.get()).docs





    let ret_house_list = store_house_list_docs.map((item) => {
      let house_entity = item.data()
      house_entity.doc_id = item.id

      //Assign likes number
      house_entity.like_count = store_house_like_docs.filter(like_item => {
        let like_entity = like_item.data()
        return like_entity.house_id == item.id
      }).length

      //Assign average rate
      let rate_count = store_house_rate_docs.filter(rate => rate.data().house_id == item.id).length > 0
        ? store_house_rate_docs.filter(rate => rate.data().house_id == item.id).length : 1
      let score_total = 0
      store_house_rate_docs.filter(item => item.data().house_id == item.id).forEach(rate => {
        score_total += rate.data().score
      })

      house_entity.avg_rate_score = score_total / rate_count

      return house_entity


    })

    // Sort the list of houses entities based on likes number
    ret_house_list = ret_house_list.sort((val1, val2) => {
      return val1.like_count - val2.like_count
    })

    sethouseList(ret_house_list)
    toast.hideLoading()


  }




  useEffect(() => {
    try {
      fetchHouseList()

    } catch (error) {
    } finally {
      toast.hideLoading()
    }

  }, [])



  DeviceEventEmitter.addListener(NotificationKeys.POST_SUCCESS, () => {
    fetchHouseList(false)
  })




  const RecommendList = () => {
    return (
      <View style={styles.recommendList}>
        <Text style={styles.recommendListText}>Popular List</Text>
      </View>
    );
  };

  // LikeHouse method, click to jump to housedetailscreen
  const HouseComponent = (props: { house: HouseEntity }) => {
    let { house } = props
    return (
      <Pressable onPress={() => navigation.navigate('HouseDetails', { id: house?.doc_id })}>
        <View style={styles.houseCard}>
          <Image source={{ uri: house.cover }} style={styles.houseCardImag} />
          <View>
            <Title style={styles.houseCardAddress}>{house.address}</Title>
            <Caption style={styles.houseCardCity}>{house.city}</Caption>
          </View>
        </View>
      </Pressable>
    );
  };
  // House and Apartment widget, data should be obtained by firebase according to the category.
  const ListOptions = () => {

    const itemList = [
      { title: 'Apartment', img: require('../assets/apartment.jpg') },
      { title: 'House', img: require('../assets/house.jpg') },
    ];
    return (
      <View style={styles.listContainer}>
        {itemList.map((item, index) => (
          <Pressable key={index.toString()} onPress={() => navigation.navigate('Property List', { item, index })}>
            <View style={styles.optionCard} >
              <Image source={item.img} style={styles.optionCardImg} />
              <Text style={styles.optionText}>{item.title}</Text>
            </View>
          </Pressable>

        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar translucent={false} backgroundColor={'#000000'} />
      {/*<View style={styles.header}>*/}
      {/*  <Text style={{color: '#c7c7c7'}}>Location</Text>*/}
      {/*  <Text style={{color: '#000000'}}>Ottawa</Text>*/}
      {/*  */}
      {/*</View>*/}

      <View style={styles.header}>
        <View>
          <Text style={{ color: '#c7c7c7' }}>Location</Text>
          <Text style={{ color: '#000000', fontSize: 22, fontWeight: 'bold' }}>
            Montreal
          </Text>
        </View>
        <Avatar.Image
          style={styles.avatar}
          source={{ uri: 'https://i.ibb.co/jVHCdf2/avatar.png' }}
          size={50}
        />
      </View>
      <ScrollView>
        <View style={styles.searchbar}>
          <Icon name={'search'} size={25} color={'#000000'} />
          <TextInput
            placeholder={'Enter address to find out!'}
            style={{
              color: "black",
              marginLeft: 5,
              flex: 1,
              height: "100%"
            }}
            returnKeyType="search"
            onChangeText={text => {
              searchContent = text
            }}
            onSubmitEditing={() => {
              console.log("searchContent--->", searchContent);

              navigation.navigate("home_house_search", { content: searchContent })
            }}

          />
        </View>
        <ListOptions />
        <RecommendList />

        <FlatList
          contentContainerStyle={styles.houseContainer}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={houseList}
          renderItem={({ item }) => <HouseComponent house={item} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default MarketScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fffff',
    flex: 1,
  },
  header: {
    paddingVertical: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  avatar: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  searchbar: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingLeft: 30
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionCard: {
    height: 200,
    width: width / 2 - 30,
    elevation: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
  },
  optionCardImg: {
    height: 140,
    borderRadius: 10,
    width: '100%',
  },
  optionText: {
    marginTop: 10,
    fontSize: 19,
    color: '#000000',
    fontWeight: 'bold',
  },
  recommendList: {
    marginTop: 5,
  },
  recommendListText: {
    marginLeft: 20,
    marginTop: 30,
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  houseCard: {
    height: 250,
    backgroundColor: '#ffffff',
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
  },
  houseContainer: {
    paddingLeft: 20,
    paddingVertical: 5,
  },
  houseCardImag: {
    width: '100%',
    height: 170,
    borderRadius: 15,

  },
  houseCardAddress: {

  },
  houseCardCity: {

  },
});
