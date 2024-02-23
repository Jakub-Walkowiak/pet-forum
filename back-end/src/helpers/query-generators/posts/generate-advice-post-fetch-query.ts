import { PostType } from "../../../types/post-types"
import { AdvicePostFetchData } from "../../../validators/advice-post-validators"
import { getContainsFilterString, getOrderByString, getResolvedString, getTagFilterString, getUserFilterString, getUserTypeFilterString } from "./post-filter-string-generators"

export const generateAdvicePostFetchQuery = (data: AdvicePostFetchData, forUser: number | undefined) => {
    const whereBlock = [
        getUserFilterString(data.fromUser),
        getUserTypeFilterString(data.desiredUsers, forUser),
        getTagFilterString(data.tagMode, data.tags, PostType.ADVICE),
        getContainsFilterString(data.contains),
        getResolvedString(data.resolved),
    ].filter(filterString => filterString !== '').join(' AND ')

    return `--sql
        SELECT id FROM blog_post
        ${whereBlock.length === 0 ? '' : `WHERE ${whereBlock}`}
        ORDER BY ${getOrderByString(data.orderBy, data.orderMode)} 
        LIMIT ${data.limit} OFFSET ${data.offset}`
}