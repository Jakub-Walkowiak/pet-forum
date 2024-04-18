'use client'

import BlurOverlay from '@/components/utils/blur-overlay'
import { useState } from 'react'
import CreateProfileForm from './create-profile-form'
import { FormMode } from './form-mode'
import LoginForm from './login-form'
import RegisterForm from './register-form'

interface AccountFormProps {
    openAs: FormMode,
    hide: VoidFunction,
}

export default function AccountForm({ openAs, hide }: AccountFormProps) {
    const [formMode, setFormMode] = useState(openAs)

    const switchForm = (mode: FormMode) => setFormMode(mode)

    let form: React.ReactNode
    switch (formMode) {
        case FormMode.Login: 
            form = <LoginForm switchForm={switchForm} hide={hide}/>
            break
        case FormMode.Register: 
            form = <RegisterForm switchForm={switchForm} hide={hide}/>
            break
        case FormMode.CreateProfile: 
            form = <CreateProfileForm hide={hide}/>
    }

    return (
        <>
            <BlurOverlay/>
            {form}
        </>
    )
}