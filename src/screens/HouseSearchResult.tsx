import toast from '@components/toast';
import { FIRE_STORE_HOUSE_COLLECTION } from '@firebase/firebase-auth';
import { HouseEntity } from '@store/entity';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ListingWidget from './TabViewWidgets/ListingWidget';

/**
 * Need to pass a search field 'content'
 * @param params
 * @returns 
 */
function HouseSearchResult({ navigation, route }) {
    let searchText = route.params.content
    const [houseList, setHouseList] = useState<Array<HouseEntity>>([])




    const onSearch = async () => {
        toast.showLoading("search ....")
        let res = await FIRE_STORE_HOUSE_COLLECTION.where("address", "==", searchText).get()
        let house_entity_list = res.docs.map(doc => {
            return doc.data()
        })
        setHouseList(house_entity_list)
        toast.hideLoading()


    }

    useEffect(() => {
        onSearch()
        navigation.setOptions({ title: searchText })
    }, [])




    return (
        <View style={styles.container}>
            <ListingWidget
                houseList={houseList}
                navigation={navigation}
            ></ListingWidget>

        </View>
    );
}

export default HouseSearchResult;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})