'use client'

import useAuthId from '@/hooks/use-auth';
import { useState } from 'react';
import LoginPopup from '../login-popup';
import { FormMode } from '../login-popup/form-mode';
import LoggedIn from './logged-in';
import LoggedOut from './logged-out';

export default function LoginPanel() {
    const [registerMode, setRegisterMode] = useState(true)
    const [showPopup, setShowPopup] = useState(false)

    const authId = useAuthId()

    return (
        <>
            {authId !== undefined
                ? <LoggedIn authId={authId}/>
                : <LoggedOut setShowPopup={setShowPopup} setRegisterMode={setRegisterMode}/>}

            {showPopup && <LoginPopup openAs={registerMode ? FormMode.Register : FormMode.Login} hide={() => setShowPopup(false)}/>}
        </>
    )
    
}