import { routes } from "@/helpers/routes";
import Link from "next/link";

export default function NavbarSideCompact() {
    return (
        <nav className="p-2 hidden max-lg:block">
            <ul className="list-none">
                {routes.map(el => 
                    <li className="font-medium rounded-lg p-2 duration-200 hover:bg-emerald-600 hover:opacity-90" key={el.name}>
                        <Link href={el.path} className="flex items-center">
                            <object data={el.icon} className="h-10 pointer-events-none"/>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}