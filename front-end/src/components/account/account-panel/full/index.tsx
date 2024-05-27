'use client'

import useAuthId from '@/hooks/use-auth'
import { useState } from 'react'
import AccountForm from '../../account-form'
import { FormMode } from '../../account-form/form-mode'
import LoggedIn from './logged-in'
import LoggedOut from './logged-out'

export default function AccountPanelFull() {
    const [registerMode, setRegisterMode] = useState(true)
    const [showPopup, setShowPopup] = useState(false)

    const authId = useAuthId()

    return (
        <>
            {authId !== undefined
                ? <LoggedIn authId={authId}/>
                : <LoggedOut setShowPopup={setShowPopup} setRegisterMode={setRegisterMode}/>}

            {showPopup && <AccountForm openAs={registerMode ? FormMode.Register : FormMode.Login} hide={() => setShowPopup(false)}/>}
        </>
    )
    
}