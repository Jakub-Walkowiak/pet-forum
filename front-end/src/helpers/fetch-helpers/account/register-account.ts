import { z } from "zod"

export const RegisterInputsValidator = z
    .object({
        email: z
            .string().trim()
            .min(1, { message: 'E-mail required' })
            .email({ message: 'Incorrect e-mail format' })
            .max(254, { message: 'E-mail must be at most 254 characters' }),
        accountName: z
            .string().trim()
            .min(1, { message: 'Account name required' })
            .max(50, { message: 'Account name must be at most 50 characters' })
            .regex(/^\w+$/, { message: 'Disallowed character in account name' }),
        password: z
            .string().trim()
            .min(10, { message: 'Password must be at least 10 characters' })
            .max(32, { message: 'Password must be at most 32 characters' })
            .regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/, { message: 'Invalid character(s) in password' }),
        repeatPassword: z.string({ required_error: 'Please repeat password' }),
    })
    .refine(data => data.password === data.repeatPassword, { message: 'Passwords do not match', path: ['repeatPassword'] })

export type RegisterInputs = z.infer<typeof RegisterInputsValidator>

export default function registerAccount(data: RegisterInputs) {
    return fetch('http://localhost:3000/accounts/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: data.email, accountName: data.accountName, password: data.password }),
    })
}