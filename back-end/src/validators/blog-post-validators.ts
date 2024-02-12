import z from 'zod'
import { OrderByMode, OrderByOption, ReplyOption, TagMode, UserTypeOption } from '../types/post-fetch-options'

export const BlogPostAddValidator = z.
    object({
        contents: z.string().min(1).max(300),
        replyTo: z.coerce.number().optional(),
    })

export const BlogPostFetchValidator = z.
    object({
        orderBy: z.nativeEnum(OrderByOption).default(OrderByOption.LIKES),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        fromUser: z.coerce.number().optional(),
        replies: z.nativeEnum(ReplyOption).default(ReplyOption.BOTH),
        replyTo: z.coerce.number().optional(),
        desiredUsers: z.nativeEnum(UserTypeOption).default(UserTypeOption.NONE),
        tags: z.coerce.number().array().optional(),
        tagMode: z.nativeEnum(TagMode).default(TagMode.ANY),
        limit: z.coerce.number().max(100),
        offset: z.coerce.number(),
    })

export type BlogPostFetchData = z.infer<typeof BlogPostFetchValidator>