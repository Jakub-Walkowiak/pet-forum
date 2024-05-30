import z from 'zod'
import { AccountOrderByOption, RelationType } from '../types/account-types'
import { OrderByMode } from '../types/order-by-mode'

export const RegistrationValidator = z.object({
    email: z.string().trim().email().max(254),
    password: z
        .string()
        .trim()
        .min(10)
        .max(32)
        .regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
    accountName: z
        .string()
        .trim()
        .min(1)
        .max(50)
        .regex(/^(\w+)$/),
})

export const LoginValidator = z
    .object({
        email: z.string().trim().email().max(254).optional(),
        accountName: z.string().trim().min(1).max(50).optional(),
        password: z
            .string()
            .trim()
            .min(10)
            .max(32)
            .regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
    })
    .refine((data) => data.email || data.accountName, {
        message: 'Either account name or email must be provided',
    })

export const AccountFetchValidator = z.object({
    contains: z.string().trim().optional(),
    limit: z.coerce.number().max(100).default(25),
    offset: z.coerce.number().default(0),
    orderBy: z.nativeEnum(AccountOrderByOption).default(AccountOrderByOption.FOLLOWERS),
    orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
    relatedTo: z.coerce.number().optional(),
    relationType: z.nativeEnum(RelationType).default(RelationType.FOLLOWERS),
    followsPet: z.coerce.number().optional(),
})

export const AccountFollowFetchValidator = z.object({
    limit: z.coerce.number().max(100).default(25),
    offset: z.coerce.number().default(0),
    orderBy: z.nativeEnum(AccountOrderByOption).default(AccountOrderByOption.FOLLOWERS),
    orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
})

export type AccountFollowFetchData = z.infer<typeof AccountFollowFetchValidator>

// Weird validation clarification:
// somewhat unintuitevily, simply slapping .optional() onto the end of a validator
// does not, in fact, only do the rest of the validation if it IS defined.
// This is a somewhat ugly workaround to that: if it's undefined, passes,
// if it's not, do the rest of the validation
export const AccountEditValidator = z.object({
    accountName: z
        .string()
        .trim()
        .max(50)
        .transform((value) => (value === '' ? undefined : value))
        .optional()
        .refine((accountName) => {
            if (accountName === undefined) return true
            else
                try {
                    z.string()
                        .regex(/^(\w+)$/)
                        .parse(accountName)
                } catch {
                    return false
                }
            return true
        }),
    displayName: z
        .string()
        .trim()
        .max(50)
        .transform((value) => (value === '' ? undefined : value))
        .optional(),
    email: z
        .string()
        .trim()
        .max(254)
        .transform((value) => (value === '' ? undefined : value))
        .optional()
        .refine((email) => {
            if (email === undefined) return true
            else
                try {
                    z.string().email().parse(email)
                } catch {
                    return false
                }
            return true
        }),
    likesVisible: z.coerce.boolean().optional(),
    followedVisible: z.coerce.boolean().optional(),
    profilePictureId: z.coerce.number().optional(),
    bio: z
        .string()
        .trim()
        .max(300)
        .transform((value) => (value === '' ? undefined : value))
        .optional(),
})

export type AccountEditData = z.infer<typeof AccountEditValidator>

export const ChangePasswordValidator = z.object({
    currentPassword: z
        .string()
        .trim()
        .min(10)
        .max(32)
        .regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
    newPassword: z
        .string()
        .trim()
        .min(10)
        .max(32)
        .regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
})
