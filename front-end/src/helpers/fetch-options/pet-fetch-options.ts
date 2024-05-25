import { z } from 'zod'

export enum PetOrderByOption {
    NAME = 'name',
    TYPE_USES = 'use_count',
    DATE_FOLLOWED = 'date_followed',
    FEATURE_COUNT = 'feature_count',
}

export enum PetSex {
    MALE = 'm',
    FEMALE = 'f',
    NOT_APPLICABLE = 'na',
}

export const PetFetchValidator = z.
    object({
        nameQuery: z.string().trim().optional(),
        type: z.coerce.number().optional(),
        sex: z.nativeEnum(PetSex).optional(),
        owner: z.coerce.number().optional(),
        limit: z.coerce.number().max(100).optional(),
        offset: z.coerce.number().optional(),
        orderMode: z.enum(['DESC', 'ASC']).optional(),
        orderBy: z.nativeEnum(PetOrderByOption).optional(),
        followedBy: z.coerce.number().optional(),
    })

type PetFetchOptions = z.infer<typeof PetFetchValidator>

export default PetFetchOptions