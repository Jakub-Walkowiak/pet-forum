export enum BlogPostOrderByOption {
    LIKES = 'like_count',
    DATE = 'date_posted',
    REPLIES = 'reply_count',
    DATE_LIKED = 'date_liked',
}

export enum UserTypeOption {
    FOLLOWED = 'followed',
    MUTUTALS = 'mutuals',
    NONE = 'none',
}

export enum MultipleMode {
    ANY = 'any',
    ALL = 'all',
}

export enum FollowedPetsMode {
    ONLY = 'only',
    APPEND = 'append',
    EXCLUDE = 'exclude',
}

export enum PostType {
    BLOG,
}

interface PostProperties {
    table: string,
    tagTable: string,
    taggedTable: string,
    petTable: string,
}

export const PostTypeProperties = new Map<PostType, PostProperties>([
    [PostType.BLOG, { table: 'blog_post', tagTable: 'blog_tag', taggedTable: 'blog_tagged', petTable: 'blog_post_pet' }],
])