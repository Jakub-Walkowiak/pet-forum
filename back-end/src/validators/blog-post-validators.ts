import z from 'zod'
import { BlogPostOrderByOption, OrderByMode, TagMode, UserTypeOption } from '../types/post-fetch-options'

export const BlogPostAddValidator = z.
    object({
        contents: z.string().min(1).max(300),
        replyTo: z.coerce.number().optional(),
    })

export const BlogPostFetchValidator = z.
    object({
        orderBy: z.nativeEnum(BlogPostOrderByOption).default(BlogPostOrderByOption.LIKES),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        fromUser: z.coerce.number().optional(),
        replies: z.coerce.boolean().optional(),
        replyTo: z.coerce.number().optional(),
        desiredUsers: z.nativeEnum(UserTypeOption).default(UserTypeOption.NONE),
        tags: z.coerce.number().array().optional(),
        tagMode: z.nativeEnum(TagMode).default(TagMode.ANY),
        limit: z.coerce.number().max(100).default(100),
        offset: z.coerce.number().default(0),
        contains: z.string().optional(),
    })

export type BlogPostFetchData = z.infer<typeof BlogPostFetchValidator>