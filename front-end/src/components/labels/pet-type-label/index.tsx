'use client'

import usePetType from '@/hooks/use-pet-type'
import { useRouter } from 'next/navigation'

interface PetTypeLabel {
    typeId: number,
}

export default function PetTypeLabel({ typeId }: PetTypeLabel) {
    const data = usePetType(typeId)
    const router = useRouter()

    const handleClick = (e: React.BaseSyntheticEvent) => {
        e.stopPropagation()
        router.replace(`/pets?types=[${typeId}]`)
    }

    if (data !== undefined) return <div onClick={handleClick} className='cursor-pointer rounded-full py-0.5 px-2 bg-emerald-900 text-emerald-200 text-xl duration-200 hover:opacity-80'>{data.typeName}</div>
    else return <div className='rounded-full py-0.5 px-2 bg-red-800 text-red-400 text-xl'>Type not found</div>
}