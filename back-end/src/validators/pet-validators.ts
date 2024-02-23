import { z } from "zod";
import { OrderByMode } from "../types/order-by-mode";
import { PetOrderByOption, PetSex } from "../types/pet-types";

export const PetAddValidator = z.
    object({
        name: z.string().min(1).max(50),
        type: z.coerce.number(),
        sex: z.nativeEnum(PetSex).default(PetSex.NOT_APPLICABLE),
        owners: z.coerce.number().array().min(1),
    })

export const PetEditValidator = z.
    object({
        name: z.string().min(1).max(50),
        type: z.coerce.number(),
        sex: z.nativeEnum(PetSex).default(PetSex.NOT_APPLICABLE),
    })

export type PetEditData = z.infer<typeof PetEditValidator>

export const PetFetchValidator = z.
    object({
        nameQuery: z.string().optional(),
        type: z.coerce.number().optional(),
        sex: z.nativeEnum(PetSex).optional(),
        owner: z.coerce.number().optional(),
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        orderByMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        orderByOption: z.nativeEnum(PetOrderByOption).default(PetOrderByOption.TYPE_USES),
    })

export type PetFetchData = z.infer<typeof PetFetchValidator>

export const OwnerAddValidator = z.
    object({
        user: z.coerce.number(),
    })