import { OrderByMode, OrderByOption, PostType, PostTypeProperties, ReplyOption, TagMode, UserTypeOption } from "../../../types/post-fetch-options"

export const getOrderByString = (by: OrderByOption, mode: OrderByMode) => `${by} ${mode}`

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

export const getTagFilterString = (mode: TagMode, tags: Array<number> | undefined, postType: PostType) => {
    if (tags === undefined || tags.length === 0) return ''

    if (mode === TagMode.ANY) return `--sql
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

export const getUserFilterString = (user: number | undefined) => user !== undefined ? `poster_id = \'${user}\'` : ''

export const getReplyFilterString = (replies: ReplyOption, to: number | undefined) =>  {
    switch (replies) {
        case ReplyOption.NO: return 'reply_to IS NULL'
        case ReplyOption.YES: return `reply_to ${to === undefined ? 'IS NOT NULL' : `= ${to}`}`
        case ReplyOption.BOTH: return `${to === undefined ? '' : `reply_to = ${to}`}`
    }
}

export const getContainsFilterString = (contains: string | undefined) => contains === undefined ? '' : `LOWER(contents) LIKE LOWER(\'%${contains}%\')`