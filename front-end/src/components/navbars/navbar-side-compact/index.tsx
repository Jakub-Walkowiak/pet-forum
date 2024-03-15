import { routes } from '@/helpers/routes';
import Link from 'next/link';

export default function NavbarSideCompact() {
    return (
        <nav className='hidden max-lg:block'>
            <ul className='list-none'>
                {routes.filter(el => el.navbar).filter(el => el.navbar).map(el => 
                    <li className='font-medium rounded-lg p-2 m-3 duration-200 hover:bg-emerald-600 hover:bg-opacity-90' key={el.name}>
                        <Link href={el.path} className='flex items-center'>
                            <object data={el.icon} className='h-12 pointer-events-none'/>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}