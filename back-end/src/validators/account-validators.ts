import z from 'zod'

export const RegistrationValidator = z.object({
    email: z.string().email(),
    password: z.string().min(10).max(32).regex(/([\w~`!@#$%^&*()_\-\+={[}\]\|\\:"',.?\/]+)/),
    accountName: z.string().min(1).max(50),
    displayName: z.string().min(1).max(50),
})

export const LoginValidator = z
    .object({
        email: z.string().email().max(254).optional(),
        accountName: z.string().min(1).max(50).optional(),
        password: z.string().min(10).max(32).regex(/([\w~`!@#$%^&*()_\-\+={[}\]\|\\:"',.?\/]+)/),
    })
    .refine(data => data.email || data.accountName, { message: 'Either account name or email must be provided' })

export const EditValidator = z
    .object({
        displayName: z.string().min(1).max(50).optional(),
        email: z.string().email().optional(),
        likeVisibility: z.coerce.boolean().optional(),
        followedVisibility: z.coerce.boolean().optional(),
    })

export type AccountEditData = z.infer<typeof EditValidator>

export const ChangePasswordValidator = z
    .object({
        currentPassword: z.string().min(10).max(32).regex(/([\w~`!@#$%^&*()_\-\+={[}\]\|\\:"',.?\/]+)/),
        newPassword: z.string().min(10).max(32).regex(/([\w~`!@#$%^&*()_\-\+={[}\]\|\\:"',.?\/]+)/),
    })

export const AddProfilePictureValidator = z.
    object({
        pictureId: z.number(),
    })