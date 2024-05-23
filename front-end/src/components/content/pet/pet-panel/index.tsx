'use client'

import PetProfilePicture from '@/components/images/profile-picture/pet'
import PetLabel from '@/components/labels/pet-label'
import PetFollowButton from '@/components/utils/follow-button/pet'
import usePet from '@/hooks/use-pet'

interface PetPanelProps {
    id: number,
}

export default function PetPanel({ id }: PetPanelProps) {
    const data = usePet(id)

    return (
        <div className='flex p-4 justify-between'>
            {data === undefined 
                ? <p className='inset-0 m-auto'>Failed to fetch pet data</p>
                : <>
                    <div className='flex gap-4'>
                        <PetProfilePicture id={id} sizeOverride={3.5}/>
                        <div className='flex items-center'><PetLabel size='large' text={data.name} id={id}/></div>
                    </div>
                    <div className='flex-0 inset-y-0 my-auto'><PetFollowButton id={id} followed={data.followed} owned={data.owned}/></div>
                </>}
        </div>
    )
}