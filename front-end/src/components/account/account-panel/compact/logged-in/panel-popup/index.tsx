import { routes } from '@/helpers/routes'
import Cookies from 'js-cookie'
import { AiOutlineLogout } from 'react-icons/ai'

interface PanelPopupProps {
  show: boolean
}

export default function PanelPopup({ show }: PanelPopupProps) {
  const accountRoute = routes.find((el) => el.name === 'Account')

  const handleLogout = () => {
    Cookies.remove('login_token', { path: '' })
    document.dispatchEvent(new CustomEvent('refreshblogpost'))
    document.dispatchEvent(new CustomEvent('refreshauth'))
  }

  return (
    <div
      className={`-z-10 duration-200 h-36 cursor-auto absolute px-1 py-2 flex flex-col w-full bg-gray-800/30 rounded-t-lg text-xl ${show ? '-translate-y-[6.75rem] opacity-1 pointer-events-auto' : 'translate-y-0 opacity-0 pointer-events-none'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='duration-200 w-full cursor-pointer hover:bg-gray-800 p-1 rounded-lg flex flex-1'>
        <a href={accountRoute?.path} className='w-full flex items-center justify-center text-5xl'>
          {/* <object data={accountRoute?.icon} className='w-full inline pointer-events-none'/> */}
          {accountRoute?.icon}
        </a>
      </div>
      <div
        onClick={handleLogout}
        className='duration-200 w-full flex cursor-pointer hover:bg-red-800/30 p-1 rounded-lg flex-1'
      >
        <div className='w-full flex items-center justify-center text-5xl text-red-600'>
          {/* <object data='/placeholder-icon.svg' className='w-full inline pointer-events-none'/> */}
          <AiOutlineLogout />
        </div>
      </div>
    </div>
  )
}
