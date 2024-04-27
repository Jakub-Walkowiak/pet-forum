import { OrderByMode } from '../../../types/order-by-mode'
import { BlogPostOrderByOption, MultipleMode, PostType, PostTypeProperties, ResponseOrderByOption, UserTypeOption } from '../../../types/post-types'

export const getOrderByString = (by: BlogPostOrderByOption | ResponseOrderByOption, mode: OrderByMode) => `${by} ${mode}, date_posted DESC`

export const getUserTypeFilterString = (input: UserTypeOption, forUser?: number) => {
    if (forUser === undefined) return ''

    switch (input) {
        case UserTypeOption.NONE: return ''

        case UserTypeOption.FOLLOWED: return `--sql
            poster_id IN (
                SELECT followed_id FROM account_follow WHERE follower_id = ${forUser}
            )`

        case UserTypeOption.MUTUTALS: return `--sql
            poster_id IN (
                SELECT followed_id FROM account_follow WHERE follower_id = ${forUser}
            ) AND poster_id IN (
                SELECT follower_id FROM account_follow WHERE followed_id = ${forUser}
            )`
    }
}

export const getTagFilterString = (mode: MultipleMode, postType: PostType, tags?: Array<number>) => {
    if (tags === undefined || tags.length === 0) return ''
    else if (mode === MultipleMode.ANY) return `--sql
        id IN (
            SELECT post_id FROM ${PostTypeProperties.get(postType)?.taggedTable}
            WHERE tag_id IN (${tags.join(',')})
        )`
    else return tags
        .map(tag => `--sql
            id IN (
                SELECT post_id FROM ${PostTypeProperties.get(postType)?.taggedTable}
                WHERE tag_id = ${tag}
            )
        `).join(' AND ')
}

export const getPetFilterString = (mode: MultipleMode, postType: PostType, pets?: Array<number>) => {
    if (pets === undefined || pets.length === 0) return ''
    else if (mode === MultipleMode.ANY) return `--sql
        id IN (
            SELECT post_id FROM ${PostTypeProperties.get(postType)?.petTable}
            WHERE pet_id IN (${pets.join(',')})
        )`
    else return pets
        .map(pet => `--sql
            id IN (
                SELECT post_id FROM ${PostTypeProperties.get(postType)?.petTable}
                WHERE pet_id = ${pet}
            )
        `).join(' AND ')
}

export const getUserFilterString = (user?: number) => user !== undefined ? `poster_id = \'${user}\'` : ''

export const getReplyFilterString = (replies?: boolean, to?: number) => 
    replies === undefined 
        ? `${to === undefined ? '' : `reply_to = ${to}`}`
        : replies
            ? `reply_to ${to === undefined ? 'IS NOT NULL' : `= ${to}`}`
            : 'reply_to IS NULL'

export const getContainsFilterString = (contains?: string) => contains === undefined ? '' : `LOWER(contents) LIKE LOWER(\'%${contains}%\')`

export const getResolvedString = (resolved?: boolean) => resolved === undefined ? '' : `${resolved ? '' : 'NOT'} resolved`

export const getBestFilterString = (isBest?: boolean) => isBest === undefined ? '' : `${isBest ? '' : 'NOT'} marked_as_best`

export const getLikedByFilterString = (likedBy?: number) => {
    return likedBy !== undefined ? `user_account_id = ${likedBy}` : ''
}