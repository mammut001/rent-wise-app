
//Enum
export enum HouseType {
    apartment = "apartment",
    house = "house"
}



/**
 * House(Apartment or House) Entity
 */
export class HouseEntity {
    /**
     *doc id, Need to assign manually when querying
     *
     * @type {*}
     * @memberof HouseEntity
     */
    doc_id: any

    address: string
    city: string
    post_code: string
    type: HouseType
    /**
     *Cover image url
     *
     * @type {string}
     * @memberof HouseEntity
     */
    cover: string

    /**
     * Like number
     * Manually assign
     *
     * @type {number}
     * @memberof HouseEntity
     */
    like_count: number


    /**
     * Average rate score, manually assign
     * @type {number}
     * @memberof HouseEntity
     */
    avg_rate_score: number
    /**
     *If the user has liked the house
     *
     * @type {boolean}
     * @memberof HouseEntity
     */
    like: boolean
}

/**
 * User Entity, since the google auth module is limited, so we provide a entity to extend it
 */
export class UserEntity {
    avatar_url: string

    email: string
    display_name: string
    /**
     * Corresponding to the google user, got uid after login
     *
     * @type {(any)}
     * @memberof UserEntity
     */
    uid: any
}

/**
 * UserHouseLikeEntity
 */
export class UserHouseLikeEntity {
    user_id: any
    house_id: any
}


/**
 * RateEntity
 */
export class RateEntiry {
    user_id: any
    score: number
    content: string
    house_id: string
    email: string

}


/**
 * UserHouseViewsEntity
 */
export class UserHouseViews {
    user_id: string
    house_id: string
}


