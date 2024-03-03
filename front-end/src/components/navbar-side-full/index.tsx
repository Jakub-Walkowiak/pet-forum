import { routes } from "@/helpers/routes";
import Link from "next/link";

export default function NavbarSideFull() {
    return (
        <nav className="hidden lg:block p-2">
            <ul className="list-none">
                {routes.map(el => 
                    <li className="text-3xl font-medium rounded-lg duration-200 hover:bg-emerald-600 hover:opacity-90" key={el.name}>
                        <Link href={el.path} className="flex items-center p-2">
                            <object data={el.icon} className="h-10 pe-3 pointer-events-none"/>
                            {el.name}
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}