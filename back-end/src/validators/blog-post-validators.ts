import z from 'zod'
import { OrderByMode } from "../types/order-by-mode"
import { BlogPostOrderByOption, TagMode, UserTypeOption } from '../types/post-types'

export const BlogPostAddValidator = z.
    object({
        contents: z.string().min(1).max(300),
        replyTo: z.coerce.number().optional(),
        pictures: z.coerce.number().array().optional(),
        tags: z.coerce.number().array().optional(),
        pets: z.coerce.number().array().optional(),
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
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        contains: z.string().optional(),
    })

export type BlogPostFetchData = z.infer<typeof BlogPostFetchValidator>

export const BlogTagFetchValidator = z.
    object({
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        nameQuery: z.string().optional(),
    })
    
export const BlogTagAddValidator = z.
    object({
        name: z.string().min(1).max(50)
    })