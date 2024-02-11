import { PostType } from "../../types/post-fetch-options";
import { BlogPostFetchData } from "../../validators/blog-post-validator";
import { getOrderByString, getReplyFilterString, getTagFilterString, getUserFilterString, getUserTypeFilterString } from "./filter-string-generators";

export const generateBlogPostFetchQuery = (data: BlogPostFetchData, forUser: number | undefined) => {
    return `--sql
        SELECT id FROM blog_post
        WHERE ${[
            getUserFilterString(data.fromUser),
            getReplyFilterString(data.replies),
            getUserTypeFilterString(data.desiredUsers, forUser),
            getTagFilterString(data.tagMode, data.tags, PostType.BLOG),
        ].filter(filterString => filterString !== '')}.join(' AND ')
        ORDER BY ${getOrderByString(data.orderBy, data.orderMode)} 
        LIMIT ${data.limit} OFFSET ${data.offset}`
}