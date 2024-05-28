import { z } from "zod"

export const PatchPasswordInputsValidator = z.object({
    currentPassword: z.string(),
    newPassword: z
        .string().trim()
        .min(10, { message: 'Password must be at least 10 characters' })
        .max(32, { message: 'Password must be at most 32 characters' })
        .regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/, { message: 'Invalid character(s) in password' }),
    repeatPassword: z.string({ required_error: 'Please repeat password' }),
}).refine(data => data.newPassword === data.repeatPassword, { message: 'Passwords do not match', path: ['repeatPassword'] })

export type PatchPasswwordInputs = z.infer<typeof PatchPasswordInputsValidator>

export default function patchPassword(data: PatchPasswwordInputs) {
    return fetch('http://localhost:3000/accounts/password', {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
        credentials: 'include',
    })
}
