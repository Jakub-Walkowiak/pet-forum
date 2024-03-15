import { OrderByMode } from '../../../types/order-by-mode'
import { AdvicePostOrderByOption, BlogPostOrderByOption, MultipleMode, PostType, PostTypeProperties, ResponseOrderByOption, UserTypeOption } from '../../../types/post-types'

export const getOrderByString = (by: BlogPostOrderByOption | AdvicePostOrderByOption | ResponseOrderByOption, mode: OrderByMode) => `${by} ${mode}`

export const getUserTypeFilterString = (input: UserTypeOption, forUser: number | undefined) => {
    if (forUser === undefined) return ''

    switch (input) {
        case UserTypeOption.NONE: return ''

        case UserTypeOption.FOLLOWED: return `--sql
            poster_id IN (
                SELECT followed_id FROM follow WHERE follower_id = ${forUser}
            )`

        case UserTypeOption.MUTUTALS: return `--sql
            poster_id IN (
                SELECT followed_id FROM follow WHERE follower_id = ${forUser}
            ) AND poster_id IN (
                SELECT follower_id FROM follow WHERE followed_id = ${forUser}
            )`
    }
}

export const getTagFilterString = (mode: MultipleMode, tags: Array<number> | undefined, postType: PostType) => {
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

export const getPetFilterString = (mode: MultipleMode, pets: Array<number> | undefined, postType: PostType) => {
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

export const getUserFilterString = (user: number | undefined) => user !== undefined ? `poster_id = \'${user}\'` : ''

export const getReplyFilterString = (replies: boolean | undefined, to: number | undefined) => 
    replies === undefined 
        ? `${to === undefined ? '' : `reply_to = ${to}`}`
        : replies
            ? `reply_to ${to === undefined ? 'IS NOT NULL' : `= ${to}`}`
            : 'reply_to IS NULL'

export const getContainsFilterString = (contains: string | undefined) => contains === undefined ? '' : `LOWER(contents) LIKE LOWER(\'%${contains}%\')`

export const getResolvedString = (resolved: boolean | undefined) => resolved === undefined ? '' : `WHERE ${resolved ? '' : 'NOT'} resolved`

export const getBestFilterString = (isBest: boolean | undefined) => isBest === undefined ? '' : `WHERE ${isBest ? '' : 'NOT'} marked_as_best`