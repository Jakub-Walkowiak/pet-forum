import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';

interface NotificationPopupProps {
    positive?: boolean,
    text: string,
}

export default function NotificationPopup({ positive = false, text }: NotificationPopupProps) {
    return (
        <div className={`${positive ? 'bg-emerald-600' : 'bg-red-600'} z-50 flex justify-center items-center gap-2 fixed inset-x-0 m-auto bottom-8 w-72 h-12 font-medium text-md rounded-lg animate-fade-out animate-poop opacity-1`}>
            {positive ? <AiFillCheckCircle className='text-2xl'/> : <AiFillExclamationCircle  className='text-2xl'/>} {text}
        </div>
    )
}