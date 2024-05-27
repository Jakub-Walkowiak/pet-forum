import AccountPanelFull from '@/components/account/account-panel/full'
import { routes } from '@/helpers/routes'
import Link from 'next/link'

export default function NavbarSideFull() {
    return (
        <nav className='flex flex-col h-full justify-between'>
            <ul className='list-none'>
                {routes.filter(el => el.navbar).map(el => 
                    <li className='text-3xl font-medium rounded-lg duration-200 hover:bg-emerald-600 hover:bg-opacity-90' key={el.name}>
                        <Link href={el.path} className='flex items-center p-2 m-3'>
                            <object data={el.icon} className='h-12 pe-3 pointer-events-none'/>
                            {el.name}
                        </Link>
                    </li>
                )}
            </ul>
            <AccountPanelFull/>
        </nav>
    )
}