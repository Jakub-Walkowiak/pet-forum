import Button from '@/components/form-utils/button'
import LoginPopup from '@/components/login-popup'
import { FormMode } from '@/components/login-popup/form-mode'
import { useState } from 'react'

export default function LoggedOut() {
    const [showPopup, setShowPopup] = useState(false)
    const [registerMode, setRegisterMode] = useState(false)

    const loginHandler = () => {
        setRegisterMode(false)
        setShowPopup(true)
    }

    const registerHandler = () => {
        setRegisterMode(true)
        setShowPopup(true)
    }

    const hide = () => setShowPopup(false)

    return (
        <div className='flex flex-col gap-2 p-2 rounded-lg grow-x m-2'>
            <Button text='Log in' onClickHandler={loginHandler}/>
            <Button dark text='Register' onClickHandler={registerHandler}/>
            {showPopup && <LoginPopup openAs={registerMode ? FormMode.Register : FormMode.Login} hide={hide}/>}
        </div>
    )
}