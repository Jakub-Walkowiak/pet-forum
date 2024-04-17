export enum AccountOrderByOption {
    ACCOUNT_NAME = 'account_name',
    DISPLAY_NAME = 'display_name',
    FOLLOWERS = 'follower_count',
    FOLLOWED = 'followed_count',
    DATE_CREATED = 'date_created',
    RESPONSE_SCORE = 'running_response_score',
    POSITIVE_RESPONSES = 'net_positive_responses',
    NEGATIVE_RESPONSES = 'net_negative_responses',
    BEST_RESPONSES = 'best_responses',
    BLOG_POSTS = 'blog_post_count',
    REPLIES = 'reply_count',
    ADVICE_POSTS = 'advice_count',
    RESPONSES = 'response_count',
    PETS = 'owned_pet_count',
    DATE_FOLLOWED = 'date_followed',
}

export enum RelationType {
    FOLLOWERS = 'followers',
    FOLLOWED = 'followed',
    MUTUALS = 'mutuals',
}