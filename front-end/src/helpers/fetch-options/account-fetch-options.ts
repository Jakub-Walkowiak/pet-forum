import { z } from 'zod'

enum AccountOrderByOption {
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

export const AccountFetchValidator = z
    .object({
        contains: z.string().trim().optional(),
        limit: z.coerce.number().optional(),
        offset: z.coerce.number().optional(),
        orderBy: z.nativeEnum(AccountOrderByOption).optional(),
        orderMode: z.enum(['ASC', 'DESC']).optional(),
        relatedTo: z.coerce.number().optional(),
        relationType: z.enum(['followers', 'followed', 'mutuals']).optional(),
        followsPet: z.coerce.number().optional(),
    })

type AccountFetchOptions = z.infer<typeof AccountFetchValidator>

export default AccountFetchOptions