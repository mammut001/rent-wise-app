import LocalStorage from "@common/localStorage";
import { FIRE_STORE_HOUSE_COLLECTION, FIRE_STORE_HOUSE_USER_LIKE_COLLECTION, FIRE_STORE_HOUSE_USER_VIEWS_COLLECTION, FIRE_STORE_RATE_COLLECTION } from "@firebase/firebase-auth";
import { useFocusEffect } from "@react-navigation/native";
import { HouseEntity } from "@store/entity";
import * as React from "react";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SceneMap, SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import ProfileNavWidget from "./ProfileNavWidget";
import ListingWidget from "./TabViewWidgets/ListingWidget";




function ProfileScreen({ navigation }) {


  const [index, setIndex] = React.useState(0)

  const [routes, setRoutes] = useState([
    { key: '0', title: 'HISTORY' },
    { key: '1', title: 'FAVOURITE' }
  ])

  const [reviewhouseList, setReviewhouseList] = useState<Array<HouseEntity>>([])
  const [favouriteHouseList, setFavouriteHouseList] = useState<Array<HouseEntity>>([])


  /**
   *
   * Check the browsing history and comments history
   */
  const fetchHouseList = async () => {
    let user_id = await LocalStorage.getUser_id()

    let store_house_like_docs = (await FIRE_STORE_HOUSE_USER_LIKE_COLLECTION
        .where("user_id", "==", user_id)
        .get()).docs

    let store_house_views_docs = (await FIRE_STORE_HOUSE_USER_VIEWS_COLLECTION
        .where("user_id", "==", user_id)
        .get()).docs

    let house_id_list_views = store_house_views_docs.map(item => {
      return item.data().house_id
    })

    let house_id_list_like = store_house_like_docs.map(item => {
      return item.data().house_id
    })



    let house_list_views = []
    setReviewhouseList([])
    house_id_list_views.forEach(async (house_id) => {

      let house_snap = await FIRE_STORE_HOUSE_COLLECTION.doc(house_id).get()

      let house = house_snap.data()

      house_list_views.push(house)
      setReviewhouseList(house_list_views)

    })


    let house_list_like = []
    setFavouriteHouseList([])
    house_id_list_like.forEach(async (house_id) => {

      let house_snap = await FIRE_STORE_HOUSE_COLLECTION.doc(house_id).get()

      let house = house_snap.data()
      house_list_like.push(house)
      setFavouriteHouseList(house_list_like)

    })



  }
  useFocusEffect(React.useCallback(() => {
    console.log('useFocusEffect-->');

    fetchHouseList()
  }, []))



  // TABVIEW COMPONENT
  const FirstRoute = () => {
    return <ListingWidget
        style={{ padding: 15 }}
        houseList={reviewhouseList}
        navigation={navigation}
        onPress={(index) => {

        }}
    />
  }
  const SecondRoute = () => {
    return <ListingWidget
        style={{ padding: 15 }}
        houseList={favouriteHouseList}
        navigation={navigation}
        onPress={(index) => {

        }}
    />
  }

  const renderScene = SceneMap({
    "0": FirstRoute,
    "1": SecondRoute,
  });




  const renderTabView = () => {
    return (
        <TabView
            navigationState={{ routes, index }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={tab_index => {
              setIndex(tab_index)
            }}
            initialLayout={{ width: Dimensions.get("window").width }
            }
            lazy={true}
            renderLazyPlaceholder={_renderLazyPlaceholder}

        />
    )
  }
  const _renderLazyPlaceholder = ({ route }) => {
    return (
        <View style={styles.scene}>
          <Text>Loading {route.title}…</Text>
        </View>
    )
  }

  const renderTabBar = (props) => {
    return (
        <TabBar
            {...props}

            scrollEnabled
            indicatorStyle={{ backgroundColor: "blue" }}
            style={{ backgroundColor: "white" }}
            labelStyle={{
              fontWeight: '400',
              color: "#333"
            }}
            tabStyle={styles.tabStyle}

            renderLabel={({ route, focused, color }) => {
              return (
                  <Text style={{
                    width: Dimensions.get("window").width / 3,
                    color: focused ? "blue" : "#1F1F20",
                    fontWeight: focused ? "bold" : "normal",
                    textAlign: "center",
                    textAlignVertical: "center",

                  }}>
                    {route.title}
                  </Text>
              )
            }}
        />
    )
  };



  return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <ProfileNavWidget
            navigation={navigation} />
        {renderTabView()}
      </View>
  );
}


export default ProfileScreen


const styles = StyleSheet.create({
  tabStyle: {
    width: Dimensions.get("window").width / 2,
    height: 42,

  },
  scene: {
    flex: 1,
    backgroundColor: "#F6F6F7",
    justifyContent: "center",
    alignItems: "center"
  },
})
