export enum BlogPostOrderByOption {
    LIKES = 'like_count',
    DATE = 'date_posted',
    REPLIES = 'reply_count',
    DATE_LIKED = 'date_liked',
}

export enum AdvicePostOrderByOption {
    DATE = 'date_posted',
    RESPONSES = 'response_count',
}

export enum ResponseOrderByOption {
    DATE = 'date_posted',
    SCORE = 'score',
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

export enum PostType {
    BLOG,
    ADVICE,
}

interface PostProperties {
    table: string,
    tagTable: string,
    taggedTable: string,
    petTable: string,
}

export const PostTypeProperties = new Map<PostType, PostProperties>([
    [PostType.BLOG, { table: 'blog_post', tagTable: 'blog_tag', taggedTable: 'blog_tagged', petTable: 'blog_post_pet' }],
    [PostType.ADVICE, { table: 'advice_post', tagTable: 'advice_tag', taggedTable: 'advice_tagged', petTable: 'advice_post_pet' }],
])