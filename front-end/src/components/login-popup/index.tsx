'use client'

import { useState } from 'react';
import BlurOverlay from '../blur-overlay';
import { FormMode } from './form-mode';
import LoginForm from './login-form';
import RegisterForm from './register-form';

interface LoginPopupProps {
    openAs: FormMode,
    hide: VoidFunction,
}

export default function LoginPopup({ openAs, hide }: LoginPopupProps) {
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
            throw new Error('Not implemented')
            break
    }

    return (
        <>
            <BlurOverlay/>
            {form}
        </>
    )
}