import { PetSex } from '@/helpers/fetch-options/pet-fetch-options'
import { useEffect, useState } from 'react'

export interface PetData {
    name: string,
    typeId: number,
    sex: PetSex,
    owners: Array<number>,
    owned: boolean,
    followed: boolean,
    profilePictureId?: number,
}

export default function usePet(id: number | undefined) {
    const [petData, getPetData] = useState<PetData>()

    const getProfileData = () => {
        const fetchData = async () => {
            if (!id) getPetData(undefined)
            else {
                const res = await fetch(`http://localhost:3000/pets/${id}`, {
                    credentials: 'include'
                })
                if (!res.ok) getPetData(undefined) 
                else getPetData(await res.json())
            }
        }
        try { fetchData() } catch (err) { getPetData(undefined) }
    }

    useEffect(getProfileData, [id])
    useEffect(() => {
        document.addEventListener('refreshpet', getProfileData)
        return () => document.removeEventListener('refreshpet', getProfileData)
    }, [])

    return petData
}