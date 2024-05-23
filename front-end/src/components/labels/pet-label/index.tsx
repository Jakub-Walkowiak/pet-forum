import stopEvent from '@/helpers/stop-event'
import Link from 'next/link'

interface PetLabelProps {
    text: string,
    id: number,
    size?: 'normal' | 'large' | 'extra_large',
}

export default function PetLabel({ text, size = 'normal', id }: PetLabelProps) {
    let sizeStyle
    switch (size) {
        case 'normal': sizeStyle = 'text-2xl'; break
        case 'large': sizeStyle = 'text-3xl'; break
        case 'extra_large': sizeStyle = 'text-5xl font-semibold'; break
    }

    return <Link onClick={stopEvent} href={`/pets/${id}`}><span title={`${text}`} className={`hover:underline flex-none font-normal max-w-full truncate ${sizeStyle}`}>{text}</span></Link>
}