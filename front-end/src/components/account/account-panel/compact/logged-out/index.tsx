import { Dispatch, SetStateAction } from 'react'
import { AiOutlineLogin } from 'react-icons/ai'

interface LoggedOutProps {
    setRegisterMode: Dispatch<SetStateAction<boolean>>,
    setShowPopup: Dispatch<SetStateAction<boolean>>,
}

export default function LoggedOut({ setRegisterMode, setShowPopup }: LoggedOutProps) {
    const loginHandler = () => {
        setRegisterMode(false)
        setShowPopup(true)
    }

    return (
        <div className='flex flex-col gap-2 p-2 rounded-lg grow-x m-2'>
            <AiOutlineLogin onClick={loginHandler} className='text-4xl duration-200 hover:opacity-70 cursor-pointer'/>
        </div>
    )
}