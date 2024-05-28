import { z } from "zod"

// Weird validation clarification:
// somewhat unintuitevily, simply slapping .optional() onto the end of a validator
// does not, in fact, only do the rest of the validation if it IS defined.
// This is a somewhat ugly workaround to that: if it's undefined, passes,
// if it's not, do the rest of the validation
export const PatchDetailsInputsValidator = z.object({
    email: z
        .string().trim()
        .max(254, { message: 'E-mail must be at most 254 characters' })
        .transform(value => value === '' ? undefined : value)
        .optional()
        .refine(email => {
            if (email === undefined) return true
            else try { z.string().email().parse(email) }
            catch { return false }
            return true
        }, { message: 'Incorrect e-mail format' }),
    accountName: z
        .string().trim()
        .max(50, { message: 'Account name must be at most 50 characters' })
        .transform(value => value === '' ? undefined : value)
        .optional()
        .refine(accountName => {
            if (accountName === undefined) return true
            else try { z.string().regex(/^(\w+)$/).parse(accountName) }
            catch { return false }
            return true
        }, { message: 'Disallowed character in account name' }),
})

export type PatchDetailsInputs = z.infer<typeof PatchDetailsInputsValidator>

export default function patchDetails(data: PatchDetailsInputs) {
    return fetch('http://localhost:3000/accounts', {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include',
    })
}