'use client'

import Button from '@/components/forms/utils/button'
import ErrorContainer from '@/components/forms/utils/error-container'
import Input from '@/components/forms/utils/input'
import CloseModalButton from '@/components/utils/close-modal-button'
import dismissModal from '@/helpers/dismiss-modal'
import login, { LoginInputs, LoginInputsValidator } from '@/helpers/fetch-helpers/account/login'
import showNotificationPopup from '@/helpers/show-notification-popup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormMode } from '../form-mode'

interface LoginFormProps {
    switchForm: (mode: FormMode) => void,
}

export default function LoginForm({ switchForm }: LoginFormProps) {
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
            const response = await login(data)

            if (response.ok) {
                showNotificationPopup(true, 'Logged in successfully')
                document.dispatchEvent(new CustomEvent('refreshauth'))
                dismissModal()
            } else if (response.status === 401) setError('password', { message: 'Incorrect password' })
            else if (response.status === 404) setError('loginKey', { message: 'No account exists with given e-mail/name' })
            else showNotificationPopup(false, 'Encountered server error')
        } catch (err) { showNotificationPopup(false, 'Error contacting server')
        } finally { setLoading(false) }
    }

    return (
        <form onSubmit={handleSubmit(async (data) => await onSubmit(data))} className='flex flex-col gap-4 px-8 py-5 fixed inset-y-0 inset-x-0 m-auto z-50 h-fit w-full max-w-xl bg-gray-900 rounded-lg items-stretch'>
            <CloseModalButton/>

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