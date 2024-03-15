'use client'

import { useState } from 'react';
import BlurOverlay from '../blur-overlay';
import LoginForm from './login-form';
import RegisterForm from './register-form';

interface LoginPopupProps {
    openInRegisterMode?: boolean,
    hide: VoidFunction,
}

export default function LoginPopup({ openInRegisterMode = false, hide }: LoginPopupProps) {
    const [registerMode, setRegisterMode] = useState(openInRegisterMode)

    const switchForm = () => setRegisterMode(!registerMode)

    return (
        <>
            <BlurOverlay/>
            {registerMode ? <RegisterForm switchForm={switchForm} hide={hide}/> : <LoginForm switchForm={switchForm} hide={hide}/>}
        </>
    )
}