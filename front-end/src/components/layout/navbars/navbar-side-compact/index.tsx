import { routes } from '@/helpers/routes'
import Link from 'next/link'

export default function NavbarSideCompact() {
    return (
        <nav>
            <ul className='list-none'>
                {routes.filter(el => el.navbar).filter(el => el.navbar).map(el => 
                    <li className='font-medium rounded-lg m-1 p-2 duration-200 hover:bg-emerald-600 hover:bg-opacity-90' key={el.name}>
                        <Link href={el.path} className='flex justify-center'>
                            <object data={el.icon} className='h-12 pointer-events-none'/>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}