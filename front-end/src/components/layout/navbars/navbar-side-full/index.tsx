import AccountPanelFull from '@/components/account/account-panel/full'
import { routes } from '@/helpers/routes'
import Link from 'next/link'

export default function NavbarSideFull() {
  return (
    <nav className='flex flex-col h-full justify-between w-72'>
      <ul className='list-none'>
        {routes
          .filter((el) => el.navbar)
          .map((el) => (
            <li
              className='text-4xl font-medium rounded-lg duration-200 hover:bg-emerald-600 hover:bg-opacity-90'
              key={el.name}
            >
              <Link href={el.path} className='flex items-center p-2 m-3'>
                <span className='me-3'>{el.icon}</span>
                {el.name}
              </Link>
            </li>
          ))}
      </ul>
      <AccountPanelFull />
    </nav>
  )
}
