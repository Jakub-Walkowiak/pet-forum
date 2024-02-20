import { ResponseFetchData } from "../../../validators/advice-post-validators"
import { getBestFilterString, getContainsFilterString, getOrderByString, getUserFilterString, getUserTypeFilterString } from "./post-filter-string-generators"

export const generateResponseFetchQuery = (data: ResponseFetchData, forUser: number | undefined) => {
    const whereBlock = [
        getUserFilterString(data.fromUser),
        getUserTypeFilterString(data.desiredUsers, forUser),
        getContainsFilterString(data.contains),
        getBestFilterString(data.isBest),
    ].filter(filterString => filterString !== '').join(' AND ')

    return `--sql
        SELECT id FROM blog_post
        ${whereBlock.length === 0 ? '' : `WHERE ${whereBlock}`}
        ORDER BY ${getOrderByString(data.orderBy, data.orderMode)} 
        LIMIT ${data.limit} OFFSET ${data.offset}`
}