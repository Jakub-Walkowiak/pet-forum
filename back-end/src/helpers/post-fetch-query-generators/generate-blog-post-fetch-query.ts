import { PostType } from "../../types/post-fetch-options";
import { BlogPostFetchData } from "../../validators/blog-post-validators";
import { getOrderByString, getReplyFilterString, getTagFilterString, getUserFilterString, getUserTypeFilterString } from "./filter-string-generators";

export const generateBlogPostFetchQuery = (data: BlogPostFetchData, forUser: number | undefined) => {
    const whereBlock = [
        getUserFilterString(data.fromUser),
        getReplyFilterString(data.replies, data.replyTo),
        getUserTypeFilterString(data.desiredUsers, forUser),
        getTagFilterString(data.tagMode, data.tags, PostType.BLOG),
    ].filter(filterString => filterString !== '').join(' AND ')

    return `--sql
        SELECT id FROM blog_post
        ${whereBlock.length === 0 ? '' : `WHERE ${whereBlock}`}
        ORDER BY ${getOrderByString(data.orderBy, data.orderMode)} 
        LIMIT ${data.limit} OFFSET ${data.offset}`
}