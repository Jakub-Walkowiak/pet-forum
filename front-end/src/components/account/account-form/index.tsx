'use client'

import { useState } from 'react'
import CreateProfileForm from './create-profile-form'
import { FormMode } from './form-mode'
import LoginForm from './login-form'
import RegisterForm from './register-form'

interface AccountFormProps {
    openAs: FormMode,
}

export default function AccountForm({ openAs }: AccountFormProps) {
    const [formMode, setFormMode] = useState(openAs)

    const switchForm = (mode: FormMode) => setFormMode(mode)

    let form: React.ReactNode
    switch (formMode) {
        case FormMode.Login: 
            form = <LoginForm switchForm={switchForm}/>
            break
        case FormMode.Register: 
            form = <RegisterForm switchForm={switchForm}/>
            break
        case FormMode.CreateProfile: 
            form = <CreateProfileForm/>
    }

    return <>{form}</>
}