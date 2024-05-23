import { useEffect, useState } from 'react'

export interface PetTypeData {
    typeName: string,
    timesUsed: number,
}

export default function usePetType(id: number) {
    const [typeData, setTypeData] = useState<PetTypeData | undefined>()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/pets/types/${id}`)
            if (!response.ok) setTypeData(undefined)
            else setTypeData(await response.json())
        }
        try { fetchData() } catch(err) { setTypeData(undefined) }
    }, [id])

    return typeData
}