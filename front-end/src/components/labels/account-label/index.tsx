import stopEvent from "@/helpers/stop-event";
import Link from "next/link";

interface AccountLabelProps {
    text: string,
    id: number,
    size?: 'normal' | 'large' | 'extra_large',
    displayName?: boolean,
}

export default function AccountLabel({ text, size = 'normal', displayName = false, id }: AccountLabelProps) {
    let sizeStyle
    switch (size) {
        case 'normal': sizeStyle = displayName ? 'text-base' : 'text-sm'; break
        case 'large': sizeStyle = displayName ? 'text-lg' : 'text-base'; break
        case 'extra_large': sizeStyle = displayName ? 'text-2xl font-semibold' : 'text-xl'; break
    }

    if (displayName) return <Link onClick={stopEvent} href={`/users/${id}`}><span title={text} className={`hover:underline flex-none truncate font-medium max-w-full white ${sizeStyle}`}>{text}</span></Link>
    else return <Link onClick={stopEvent} href={`/users/${id}`}><span title={`@${text}`} className={`hover:underline flex-none font-normal text-zinc-500 max-w-full truncate ${sizeStyle}`}>@{text}</span></Link>
}