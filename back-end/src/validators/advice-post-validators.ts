import z from 'zod'
import { AdvicePostOrderByOption, OrderByMode, ResponseOrderByOption, TagMode, UserTypeOption } from '../types/post-fetch-options'

export const AdvicePostAddValidator = z.
    object({
        contents: z.string().min(1).max(10000),
    })

export const AdvicePostFetchValidator = z.
    object({
        orderBy: z.nativeEnum(AdvicePostOrderByOption).default(AdvicePostOrderByOption.RESPONSES),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        fromUser: z.coerce.number().optional(),
        desiredUsers: z.nativeEnum(UserTypeOption).default(UserTypeOption.NONE),
        tags: z.coerce.number().array().optional(),
        tagMode: z.nativeEnum(TagMode).default(TagMode.ANY),
        limit: z.coerce.number().max(100).default(100),
        offset: z.coerce.number().default(0),
        contains: z.string().optional(),
        resolved: z.coerce.boolean().optional(),
    })

export type AdvicePostFetchData = z.infer<typeof AdvicePostFetchValidator>

export const ResponseAddValidator = z.
    object({
        contents: z.string().min(1).max(10000),
        responseTo: z.number(),
    })

export const ResponseFetchValidator = z.
    object({
        orderBy: z.nativeEnum(ResponseOrderByOption).default(ResponseOrderByOption.SCORE),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        fromUser: z.coerce.number().optional(),
        desiredUsers: z.nativeEnum(UserTypeOption).default(UserTypeOption.NONE),
        limit: z.coerce.number().max(100).default(100),
        offset: z.coerce.number().default(0),
        contains: z.string().optional(),
        isBest: z.coerce.boolean().optional(),
    })

export type ResponseFetchData = z.infer<typeof ResponseFetchValidator>

export const ResponseRateAddValidator = z.
    object({
        isPositive: z.coerce.boolean(),
    })