import Button from '@/components/form-utils/button';
import ErrorContainer from '@/components/form-utils/error-container';
import Input from '@/components/form-utils/input';
import showNotificationPopup from '@/helpers/show-notification-popup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { z } from 'zod';
import { FormMode } from '../form-mode';

interface RegisterFormProps {
    switchForm: (mode: FormMode) => void,
    hide: VoidFunction,
}

const RegisterInputsValidator = z
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

type RegisterInputs = z.infer<typeof RegisterInputsValidator>
    

export default function RegisterForm({ switchForm, hide }: RegisterFormProps) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterInputs>({
        resolver: zodResolver(RegisterInputsValidator)
    })

    const error = () => errors.email !== undefined
                     || errors.accountName !== undefined
                     || errors.password !== undefined
                     || errors.repeatPassword !== undefined

    const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
        setLoading(true)

        try {
            const response = await fetch('http://localhost:3000/accounts/register', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: data.email, accountName: data.accountName, password: data.password }),
            })
    
            if (response.ok) {
                showNotificationPopup(true, 'Registered successfully')
                hide()
            } else if (response.status === 409) {
                const body = await response.json()

                if (body.emailDupe) setError('email', { message: 'Account with e-mail already exists' })
                if (body.accountNameDupe) setError('accountName', { message: 'Account name already in use' })
            } else showNotificationPopup(false, 'Encountered server error')
        } catch (err) { showNotificationPopup(false, 'Error contacting server')
        } finally { setLoading(false) }
    }

    return (
        <form onSubmit={handleSubmit(async (data) => await onSubmit(data))} className='flex flex-col gap-4 px-8 py-5 items-center absolute top-0 bottom-0 left-0 right-0 m-auto z-50 h-fit w-full max-w-xl bg-gray-900 rounded-lg items-stretch'>
            <AiOutlineClose className='text-xl self-end hover:cursor-pointer' onClick={hide}/>

            <Input placeholder='E-mail' register={register} name='email' error={errors.email !== undefined}/>
            <Input placeholder='Account name' register={register} name='accountName' error={errors.accountName !== undefined}/>
            <Input placeholder='Password' register={register} name='password' error={errors.password !== undefined} password/>
            <Input placeholder='Repeat password' register={register} name='repeatPassword' error={errors.repeatPassword !== undefined} password/>
            
            <div className='h-10'/>

            <ErrorContainer>
                {errors.email && <p>{errors.email.message}</p>}
                {errors.accountName && <p>{errors.accountName.message}</p>}
                {errors.password && <p>{errors.password.message}</p>}
                {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
            </ErrorContainer>
            
            <Button text='Register' disabled={error()} loading={loading}/>

            <div className='text-center scale-90 font-light'>Already have an account?  <Button dark text='Sign in' onClickHandler={() => switchForm(FormMode.Login)}/></div>
        </form>
    )
}