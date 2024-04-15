import { PostType } from '../../../types/post-types'
import { BlogPostFetchData } from '../../../validators/blog-post-validators'
import { getContainsFilterString, getOrderByString, getPetFilterString, getReplyFilterString, getTagFilterString, getUserFilterString, getUserTypeFilterString } from './post-filter-string-generators'

export const generateBlogPostFetchQuery = (data: BlogPostFetchData, forUser?: number) => {
    const whereBlock = [
        getUserFilterString(data.fromUser),
        getReplyFilterString(data.replies, data.replyTo),
        getUserTypeFilterString(data.desiredUsers, forUser),
        getTagFilterString(data.tagMode, PostType.BLOG, data.tags),
        getContainsFilterString(data.contains),
        getPetFilterString(data.petMode, PostType.BLOG, data.pets),
    ].filter(filterString => filterString !== '').join(' AND ')

    return `--sql
        SELECT id FROM blog_post
        ${whereBlock.length === 0 ? '' : `WHERE ${whereBlock}`}
        ORDER BY ${getOrderByString(data.orderBy, data.orderMode)} 
        LIMIT ${data.limit} OFFSET ${data.offset}`
}