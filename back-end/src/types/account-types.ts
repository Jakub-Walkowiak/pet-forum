export enum AccountOrderByOption {
    ACCOUNT_NAME = 'account_name',
    DISPLAY_NAME = 'display_name',
    FOLLOWERS = 'follower_count',
    FOLLOWED = 'followed_count',
    DATE_CREATED = 'date_created',
    BLOG_POSTS = 'blog_post_count',
    REPLIES = 'reply_count',
    PETS = 'owned_pet_count',
    DATE_FOLLOWED = 'date_followed',
    PET_DATE_FOLLOWED = 'pet_date_followed',
}

export enum RelationType {
    FOLLOWERS = 'followers',
    FOLLOWED = 'followed',
    MUTUALS = 'mutuals',
}