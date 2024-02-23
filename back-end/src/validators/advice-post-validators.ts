import z from 'zod'
import { OrderByMode } from "../types/order-by-mode"
import { AdvicePostOrderByOption, MultipleMode, ResponseOrderByOption, UserTypeOption } from '../types/post-types'

export const AdvicePostAddValidator = z.
    object({
        contents: z.string().min(1).max(10000),
        pictures: z.coerce.number().array().optional(),
        tags: z.coerce.number().array().optional(),
        pets: z.coerce.number().array().optional(),
    })

export const AdvicePostFetchValidator = z.
    object({
        orderBy: z.nativeEnum(AdvicePostOrderByOption).default(AdvicePostOrderByOption.RESPONSES),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        fromUser: z.coerce.number().optional(),
        desiredUsers: z.nativeEnum(UserTypeOption).default(UserTypeOption.NONE),
        tags: z.coerce.number().array().optional(),
        tagMode: z.nativeEnum(MultipleMode).default(MultipleMode.ANY),
        limit: z.coerce.number().max(100).default(100),
        offset: z.coerce.number().default(0),
        contains: z.string().optional(),
        resolved: z.coerce.boolean().optional(),
        pets: z.coerce.number().array().optional(),
        petMode: z.nativeEnum(MultipleMode).default(MultipleMode.ANY),
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

export const AdviceTagFetchValidator = z.
    object({
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        nameQuery: z.string().optional(),
    })
    
export const AdviceTagAddValidator = z.
    object({
        name: z.string().min(1).max(50)
    })