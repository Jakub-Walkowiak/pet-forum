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

interface LoginFormProps {
    switchForm: (mode: FormMode) => void,
    hide: VoidFunction,
}

const LoginInputsValidator = z
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

type LoginInputs = z.infer<typeof LoginInputsValidator>


export default function LoginForm({ switchForm, hide }: LoginFormProps) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginInputs>({
        resolver: zodResolver(LoginInputsValidator)
    })

    const error = () => errors.loginKey !== undefined || errors.password !== undefined

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        setLoading(true)

        try {
            const reqBody = data.loginKey.includes('@')
                ? { email: data.loginKey, password: data.password }
                : { accountName: data.loginKey, password: data.password }

            const response = await fetch('http://localhost:3000/accounts/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
                credentials: 'include',
            })
    
            if (response.ok) {
                showNotificationPopup(true, 'Logged in successfully')
                document.dispatchEvent(new CustomEvent('refreshauth'))
                hide()
            } else if (response.status === 401) setError('password', { message: 'Incorrect password' })
            else if (response.status === 404) setError('loginKey', { message: 'No account exists with given e-mail/name' })
            else showNotificationPopup(false, 'Encountered server error')
        } catch (err) { showNotificationPopup(false, 'Error contacting server')
        } finally { setLoading(false) }
    }

    return (
        <form onSubmit={handleSubmit(async (data) => await onSubmit(data))} className='flex flex-col gap-4 px-8 py-5 items-center fixed inset-y-0 inset-x-0 m-auto z-50 h-fit w-full max-w-xl bg-gray-900 rounded-lg items-stretch'>
            <AiOutlineClose className='text-xl self-end hover:cursor-pointer' onClick={hide}/>

            <Input placeholder='E-mail or account name' register={register} name='loginKey' error={errors.loginKey !== undefined}/>
            <Input placeholder='Password' register={register} name='password' error={errors.password !== undefined} password/>
            
            <div className='h-10'/>

            <ErrorContainer>
                {errors.loginKey && <p>{errors.loginKey.message ? errors.loginKey.message : 'Valid account name or e-mail required'}</p>}
                {errors.password && <p>{errors.password.message}</p>}
            </ErrorContainer>
            
            <Button text='Log in' disabled={error()} loading={loading}/>

            <div className='text-center scale-90 font-light'>Don&apos;t have an account?  <Button dark text='Register' onClickHandler={() => switchForm(FormMode.Register)}/></div>
        </form>
    )
}