import { routes } from '@/helpers/routes'
import Cookies from 'js-cookie'
import { AiOutlineLogout } from 'react-icons/ai'

interface PanelPopupProps {
    show: boolean,
}

export default function PanelPopup({ show }: PanelPopupProps) {
    const accountRoute = routes.find(el => el.name === 'Account')

    const handleLogout = () => {
        Cookies.remove('login_token', { path: '' })
        document.dispatchEvent(new CustomEvent('refreshblogpost'))
        document.dispatchEvent(new CustomEvent('refreshauth'))
    }

    return (
        <div className={`-z-10 duration-200 h-full cursor-auto absolute left-0 top-0 p-1 flex flex-col w-full bg-gray-800/30 rounded-t-lg text-xl ${show ? '-translate-y-full opacity-1 pointer-events-auto' : 'translate-y-0 opacity-0 pointer-events-none'}`}
            onClick={e => e.stopPropagation()}>
            <div className='duration-200 w-full cursor-pointer hover:bg-gray-800 p-1 rounded-lg flex flex-1'>
                <a href={accountRoute?.path} className='flex w-full h-full items-center gap-2'>
                    {accountRoute?.icon}
                    <p>Settings</p>
                </a> 
            </div>
            <div onClick={handleLogout} className='duration-200 w-full flex cursor-pointer hover:bg-red-800/30 p-1 rounded-lg flex-1'>
                <div className='flex w-full h-full items-center text-red-600 gap-2'>
                    <AiOutlineLogout/>
                    <p>Log out</p>
                </div>
            </div>
        </div>
    )
}