import { z } from 'zod'
import { OrderByMode } from '../types/order-by-mode'
import { PetOrderByOption, PetSex } from '../types/pet-types'

export const PetAddValidator = z.
    object({
        name: z.string().trim().min(1).max(50),
        type: z.coerce.number(),
        sex: z.nativeEnum(PetSex).default(PetSex.NOT_APPLICABLE),
        owners: z.coerce.number().array().min(1),
        profilePictureId: z.coerce.number().optional(),
    })

export const PetEditValidator = z.
    object({
        name: z.string().trim().min(1).max(50).optional(),
        type: z.coerce.number().optional(),
        sex: z.nativeEnum(PetSex).optional(),
        profilePictureId: z.coerce.number().optional(),
    })

export type PetEditData = z.infer<typeof PetEditValidator>

export const PetFetchValidator = z.
    object({
        nameQuery: z.string().trim().optional(),
        type: z.coerce.number().optional(),
        sex: z.nativeEnum(PetSex).optional(),
        owner: z.coerce.number().optional(),
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        orderBy: z.nativeEnum(PetOrderByOption).default(PetOrderByOption.FEATURE_COUNT),
        followedBy: z.coerce.number().optional(),
    })

export type PetFetchData = z.infer<typeof PetFetchValidator>

export const OwnerAddValidator = z.
    object({
        user: z.coerce.number(),
    })


export const PetTypeFetchValidator = z.
    object({
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        nameQuery: z.string().trim().optional(),
        exactMatch: z.coerce.boolean().default(false),
    })
    
export const PetTypeAddValidator = z.
    object({
        name: z.string().trim().min(1).max(50)
    })