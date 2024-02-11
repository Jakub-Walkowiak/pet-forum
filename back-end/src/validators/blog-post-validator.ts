import z from 'zod'
import { OrderByMode, OrderByOption, TagMode, UserTypeOption } from '../types/post-fetch-options'

export const BlogPostAddValidator = z.
    object({
        posterId: z.number(),
        contents: z.string().min(1).max(300),
        replyTo: z.number().optional(),
    })

export const BlogPostFetchValidator = z.
    object({
        orderBy: z.nativeEnum(OrderByOption).default(OrderByOption.LIKES),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        fromUser: z.number().optional(),
        replies: z.boolean().default(false),
        desiredUsers: z.nativeEnum(UserTypeOption).default(UserTypeOption.NONE),
        tags: z.number().array().optional(),
        tagMode: z.nativeEnum(TagMode).default(TagMode.ANY),
        limit: z.number(),
        offset: z.number(),
    })

export type BlogPostFetchData = z.infer<typeof BlogPostFetchValidator>