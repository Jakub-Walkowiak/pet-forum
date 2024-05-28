import { z } from "zod"

export const LoginInputsValidator = z
    .object({
        loginKey: z
            .string().trim().min(1).email().max(254)
            .or(z.string().trim().min(1).max(50).regex(/^\w+$/)),
        password: z
            .string().trim()
            .min(10, { message: 'Password must be at least 10 characters' })
            .max(32, { message: 'Password must be at most 32 characters' })
            .regex(/^([\w~`!@#$%^&*()_\-\+={[}\]\|\\:'',.?\/]+)$/, { message: 'Invalid character(s) in password' }),
    })

export type LoginInputs = z.infer<typeof LoginInputsValidator>

export default function login(data: LoginInputs) {
    const reqBody = data.loginKey.includes('@')
        ? { email: data.loginKey, password: data.password }
        : { accountName: data.loginKey, password: data.password }

    return fetch('http://localhost:3000/accounts/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody),
        credentials: 'include',
    })
}