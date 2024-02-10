import z from 'zod'

export const BlogPostAddValidator = z.
    object({
        posterId: z.number(),
        contents: z.string().min(1).max(300),
        replyTo: z.number().optional(),
    })

export const BlogPostFetchValidator = z.
    object({
        orderBy: z.enum(['LIKES', 'DATE', 'REPLIES']).default('LIKES'),
        orderMode: z.enum(['ASC', 'DESC']).default('DESC'),
        user: z.string().optional(),
        replies: z.boolean().default(false),
        desiredUsers: z.enum(['MUTUALS', 'FOLLOWED']).optional(),
        tags: z.number().array().optional(),
        tagMode: z.enum(['ALL', 'ANY']).default('ALL'),
        limit: z.number(),
        offset: z.number(),
    })

export type BlogPostFetchData = z.infer<typeof BlogPostFetchValidator>