export enum OrderByOption {
    LIKES = 'like_count',
    DATE = 'date_posted',
    REPLIES = 'reply_count',
}

export enum OrderByMode {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum UserTypeOption {
    FOLLOWED = 'followed',
    MUTUTALS = 'mutuals',
    NONE = 'none',
}

export enum TagMode {
    ANY = 'any',
    ALL = 'all',
}

export enum PostType {
    BLOG,
    ADVICE,
}

export enum ReplyOption {
    NO = 'no',
    YES = 'yes',
    BOTH = 'both',
}

interface PostProperties {
    table: string,
    tagTable: string,
    taggedTable: string,
}

export const PostTypeProperties = new Map<PostType, PostProperties>([
    [PostType.BLOG, { table: 'blog_post', tagTable: 'blog_tag', taggedTable: 'blog_tagged' }],
    [PostType.ADVICE, { table: 'advice_post', tagTable: 'advice_tag', taggedTable: 'advice_tagged' }],
])