import { HouseEntity, RateEntiry, UserEntity, UserHouseLikeEntity, UserHouseViews } from '@store/entity';
import { FIRE_STORE_HOUSE_COLLECTION, FIRE_STORE_HOUSE_USER_LIKE_COLLECTION, FIRE_STORE_RATE_COLLECTION } from './firebase-auth';




/**
 * Fetches the house details data
 * @param house_id 
 * @returns 
 */
export const fetchHouseDetail = async (house_id: any) => {

    /**
    * All likes of the house
    */
    let store_house_like_docs = (await FIRE_STORE_HOUSE_USER_LIKE_COLLECTION.get()).docs
    /**
     * All comments of the house
     */
    let store_house_rate_docs = (await FIRE_STORE_RATE_COLLECTION.get()).docs

    let res_house_snap = await FIRE_STORE_HOUSE_COLLECTION.doc(house_id).get()
    let house_entity = res_house_snap.data()


    house_entity.doc_id = res_house_snap.id

    //Assign the likes
    house_entity.like_count = store_house_like_docs.filter(like_item => {
        let like_entity = like_item.data()
        return like_entity.house_id == house_id
    }).length

    //Assign the average rate
    let rate_count = store_house_rate_docs.filter(rate => rate.data().house_id == house_id).length > 0
        ? store_house_rate_docs.filter(rate => rate.data().house_id == house_id).length : 1
    let score_total = 0
    store_house_rate_docs.filter(item => item.data().house_id == house_id).forEach(rate => {
        score_total += rate.data().score
    })

    house_entity.avg_rate_score = score_total / rate_count

    return house_entity



}