import { RelationType } from "../../../types/account-types";

const generateFollowersJoin = (id: number) => {
    return `--sql
        JOIN follow follower ON follower.follower_id = id
        AND follower.followed_id = ${id} AND follower_id NOT IN (
            SELECT id FROM user_account WHERE NOT followed_visible AND id <> ${id}
        )`
}

const generateFollowedJoin = (id: number) => {
    return `JOIN follow followed ON followed.followed_id = id AND followed.follower_id = ${id}`
}

const generateRelationTypeJoin = (type: RelationType, id?: number) => {
    if (id === undefined) return ''
    switch (type) {
        case RelationType.FOLLOWERS: return generateFollowersJoin(id)
        case RelationType.FOLLOWED: return generateFollowedJoin(id)
        case RelationType.MUTUALS: return generateFollowersJoin(id) + ' ' + generateFollowedJoin(id)
    }
}

export default generateRelationTypeJoin