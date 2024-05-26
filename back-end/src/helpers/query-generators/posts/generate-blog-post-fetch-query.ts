import { BlogPostOrderByOption, FollowedPetsMode, PostType } from '../../../types/post-types'
import { BlogPostFetchData } from '../../../validators/blog-post-validators'
import { getContainsFilterString, getFollowedPetsFilterString, getLikedByFilterString, getOrderByString, getPetFilterString, getReplyFilterString, getTagFilterString, getUserFilterString, getUserTypeFilterString } from './post-filter-string-generators'

export const generateBlogPostFetchQuery = (data: BlogPostFetchData, forUser?: number) => {
    const whereBlock = [
        [
            getUserFilterString(data.fromUser),
            getReplyFilterString(data.replies, data.replyTo),
            getUserTypeFilterString(data.desiredUsers, forUser),
            getTagFilterString(data.tagMode, PostType.BLOG, data.tags),
            getContainsFilterString(data.contains),
            getPetFilterString(data.petMode, PostType.BLOG, data.pets),
            getLikedByFilterString(data.likedBy),
        ].filter(filterString => filterString !== '').join(' AND '),
        !(forUser && data.followedPets) ? '' : getFollowedPetsFilterString(data.followedPets, forUser),
    ].filter(filterString => filterString !== '').join(data.followedPets === FollowedPetsMode.APPEND ? ' OR ' : ' AND ')

    return `--sql
        SELECT id FROM blog_post
        ${data.likedBy ? 'JOIN post_like ON id = post_id' : ''}
        ${whereBlock.length === 0 ? '' : `WHERE ${whereBlock}`}
        ORDER BY ${getOrderByString(!(data.orderBy === BlogPostOrderByOption.DATE_LIKED && data.likedBy === undefined) ? data.orderBy : BlogPostOrderByOption.LIKES, data.orderMode)} 
        LIMIT ${data.limit} OFFSET ${data.offset}`
}