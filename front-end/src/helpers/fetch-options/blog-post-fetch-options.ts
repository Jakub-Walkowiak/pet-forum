import { z } from 'zod'

export const BlogPostFetchValidator = z
    .object({
        orderBy: z.enum(['like_count', 'date_posted', 'reply_count', 'date_liked']).optional(),
        orderMode: z.enum(['ASC', 'DESC']).optional(),
        fromUser: z.coerce.number().optional(),
        replies: z.coerce.boolean().optional(),
        replyTo: z.coerce.number().optional(),
        desiredUsers: z.enum(['followed', 'mutuals', 'none']).optional(),
        tags: z.string()
            .refine(raw => raw.startsWith('[') && raw.endsWith(']'))
            .transform(str => str.substring(1, str.length - 1).split(','))
            .refine(split => split.every(el => !isNaN(Number(el))))
            .transform(checked => checked.map(el => Number(el)))
            .optional(),
        tagMode: z.enum(['any', 'all']).optional(),
        limit: z.coerce.number().optional(),
        offset: z.coerce.number().optional(),
        contains: z.string().optional(),
        pets: z.string()
            .refine(raw => raw.startsWith('[') && raw.endsWith(']'))
            .transform(str => str.substring(1, str.length - 1).split(','))
            .refine(split => split.every(el => !isNaN(Number(el))))
            .transform(checked => checked.map(el => Number(el)))
            .optional(),
        petMode: z.enum(['any', 'all']).optional(),
        likedBy: z.coerce.number().optional(),
    })

type BlogPostFetchOptions = z.infer<typeof BlogPostFetchValidator>

export default BlogPostFetchOptions