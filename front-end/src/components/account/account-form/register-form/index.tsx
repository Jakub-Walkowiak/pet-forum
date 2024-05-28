'use client'

import Button from '@/components/forms/utils/button'
import ErrorContainer from '@/components/forms/utils/error-container'
import Input from '@/components/forms/utils/input'
import CloseModalButton from '@/components/utils/close-modal-button'
import login from '@/helpers/fetch-helpers/account/login'
import registerAccount, { RegisterInputs, RegisterInputsValidator } from '@/helpers/fetch-helpers/account/register-account'
import showNotificationPopup from '@/helpers/show-notification-popup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormMode } from '../form-mode'

interface RegisterFormProps {
    switchForm: (mode: FormMode) => void,
}    

export default function RegisterForm({ switchForm }: RegisterFormProps) {
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
            const response = await registerAccount(data)
    
            if (response.ok) {
                showNotificationPopup(true, 'Registered, logging in...')

                await login({ loginKey: data.email, password: data.password })
                showNotificationPopup(true, 'Logged in successfully')
                document.dispatchEvent(new CustomEvent('refreshauth'))
                
                switchForm(FormMode.CreateProfile)
            } else if (response.status === 409) {
                const body = await response.json()

                if (body.emailDupe) setError('email', { message: 'Account with e-mail already exists' })
                if (body.accountNameDupe) setError('accountName', { message: 'Account name already in use' })
            } else showNotificationPopup(false, 'Encountered server error')
        } catch (err) { showNotificationPopup(false, 'Error contacting server')
        } finally { setLoading(false) }
    }

    return (
        <form onSubmit={handleSubmit(async (data) => await onSubmit(data))} className='flex flex-col gap-4 px-8 py-5 fixed inset-y-0 inset-x-0 m-auto z-50 h-fit w-full max-w-xl bg-gray-900 rounded-lg items-stretch'>
            <CloseModalButton/>

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