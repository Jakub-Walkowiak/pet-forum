import z from 'zod'
import { AccountOrderByOption, RelationType } from '../types/account-types'
import { OrderByMode } from '../types/order-by-mode'

export const RegistrationValidator = z.object({
    email: z.string().trim().email().max(254),
    password: z.string().trim().min(10).max(32).regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
    accountName: z.string().trim().min(1).max(50).regex(/^(\w+)$/),
})

export const LoginValidator = z
    .object({
        email: z.string().trim().email().max(254).optional(),
        accountName: z.string().trim().min(1).max(50).optional(),
        password: z.string().trim().min(10).max(32).regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
    })
    .refine(data => data.email || data.accountName, { message: 'Either account name or email must be provided' })

export const AccountFetchValidator = z
    .object({
        contains: z.string().trim().optional(),
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        orderBy: z.nativeEnum(AccountOrderByOption).default(AccountOrderByOption.FOLLOWERS),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
        relatedTo: z.coerce.number().optional(),
        relationType: z.nativeEnum(RelationType).default(RelationType.FOLLOWERS),
    })

export const AccountFollowFetchValidator = z
    .object({
        limit: z.coerce.number().max(100).default(25),
        offset: z.coerce.number().default(0),
        orderBy: z.nativeEnum(AccountOrderByOption).default(AccountOrderByOption.FOLLOWERS),
        orderMode: z.nativeEnum(OrderByMode).default(OrderByMode.DESC),
    })

export type AccountFollowFetchData = z.infer<typeof AccountFollowFetchValidator>

export const AccountEditValidator = z
    .object({
        displayName: z.string().trim().max(50).transform(value => value === '' ? undefined : value),
        email: z.string().trim().email().optional(),
        likeVisibility: z.coerce.boolean().optional(),
        followedVisibility: z.coerce.boolean().optional(),
        profilePictureId: z.coerce.number().optional(),
        bio: z.string().trim().max(300).transform(value => value === '' ? undefined : value),
    })

export type AccountEditData = z.infer<typeof AccountEditValidator>

export const ChangePasswordValidator = z
    .object({
        currentPassword: z.string().trim().min(10).max(32).regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
        newPassword: z.string().trim().min(10).max(32).regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/),
    })

export const AddProfilePictureValidator = z.
    object({
        pictureId: z.number(),
    })