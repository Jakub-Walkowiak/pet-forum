import Button from '@/components/forms/utils/button'
import { Dispatch, SetStateAction } from 'react'

interface LoggedOutProps {
    setRegisterMode: Dispatch<SetStateAction<boolean>>,
    setShowPopup: Dispatch<SetStateAction<boolean>>,
}

export default function LoggedOut({ setRegisterMode, setShowPopup }: LoggedOutProps) {
    const loginHandler = () => {
        setRegisterMode(false)
        setShowPopup(true)
    }

    const registerHandler = () => {
        setRegisterMode(true)
        setShowPopup(true)
    }

    return (
        <div className='hidden lg:flex flex-col gap-2 p-2 rounded-lg grow-x m-2'>
            <Button text='Log in' onClickHandler={loginHandler}/>
            <Button dark text='Register' onClickHandler={registerHandler}/>
        </div>
    )
}