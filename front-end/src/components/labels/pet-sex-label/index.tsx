'use client'

import { PetSex } from '@/helpers/fetch-options/pet-fetch-options'
import getPetSexName from '@/helpers/get-pet-sex-name'
import { useRouter } from 'next/navigation'

interface PetSexLabelProps {
    sex: PetSex,
}

export default function PetSexLabel({ sex }: PetSexLabelProps) {
    const router = useRouter()

    const handleClick = (e: React.BaseSyntheticEvent) => {
        e.stopPropagation()
        router.replace(`/pets?sex=${sex}`)
    }

    return <div onClick={handleClick} className='cursor-pointer rounded-full py-0.5 px-2 bg-emerald-900 text-emerald-200 text-lg duration-200 hover:opacity-80 whitespace-nowrap'>{getPetSexName(sex)}</div>
}