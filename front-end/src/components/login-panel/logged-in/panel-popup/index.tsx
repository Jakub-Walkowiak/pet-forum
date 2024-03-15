import { routes } from "@/helpers/routes";
import Cookies from "js-cookie";

interface PanelPopupProps {
    show: boolean,
}

export default function PanelPopup({ show }: PanelPopupProps) {
    const accountRoute = routes.find(el => el.name === 'Account')

    return (
        <div className={`cursor-auto absolute p-1 flex flex-col w-full border-t-4 border-x-4 border-gray-800 bg-gray-800/30 -top-[92px] rounded-t-lg text-2xl ${!show && 'h-0'}`}
            onClick={e => e.stopPropagation()}>
            <div className="duration-200 w-full cursor-pointer hover:bg-gray-800 p-1 rounded-lg">
                <a href={accountRoute?.path} className="flex w-full">
                    <object data={accountRoute?.icon} className='h-8 me-2 inline'/>
                    <p>Settings</p>
                </a> 
            </div>
            <div className="duration-200 w-full flex cursor-pointer hover:bg-red-800/30 p-1 rounded-lg">
                <object data='placeholder-icon.svg' className='h-8 me-2 inline'/>
                <p className='text-red-600' onClick={() => Cookies.remove('login_token')}>Log out</p>
            </div>
        </div>
    )
}