'use client'

import PetProfilePicture from '@/components/images/profile-picture/pet'
import PetLabel from '@/components/labels/pet-label'
import TimeLabel from '@/components/labels/time-label'
import PetFollowButton from '@/components/utils/follow-button/pet'
import usePet from '@/hooks/use-pet'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PetHeaderProps {
    id: number,
}

export default function PetHeader({ id, }: PetHeaderProps) {
    const data = usePet(id)
    const router = useRouter()

    const [clientFollow, setClientFollow] = useState(false)

    const redirectFollowers = () => router.push(`/pets?relationType=followers&relatedTo=${id}`)

    if (data === undefined) return (
        <div className='flex items-center justify-center text-2xl font-semibold'>Encountered error fetching pet profile</div>
    )
    else return (
        <div className='w-full'>
            <div className='w-full aspect-[13/3] bg-emerald-800'/>
            <div className='w-full relative flex p-2 gap-2'>
                <div className='bg-gray-900 rounded-full p-1 w-fit relative -top-12 flex-shrink-0'>
                    <PetProfilePicture id={id} sizeOverride={10}/>
                </div>
                <div className='flex flex-col'>
                    <PetLabel id={id} text={data.name} size='extra_large'/>
                </div>
                <div className='absolute top-36 left-3'><PetFollowButton id={id} followed={data.followed} onChange={setClientFollow} owned={data.owned}/></div>
            </div>

            <div className='flex px-3 py-4 items-end'>
                <span className='cursor-pointer group' onClick={redirectFollowers}>
                    <span className='font-bold pe-1 text-lg'>{data.followerCount + (clientFollow === data.followed ? 0 : clientFollow ? 1 : -1)}</span>
                    <span className='text-gray-500 text-lg pe-3 group-hover:underline'>Followers</span>
                </span>
                <span>
                    <span className='font-bold pe-1 text-lg'>{data.featureCount}</span>
                    <span className='text-gray-500 text-lg pe-3'>Posts featured in</span>
                </span>

                <div className='flex-1 flex justify-end h-fit'>
                    <TimeLabel mode='date' date={new Date(data.dateCreated)} prefix='Joined'/>
                </div>
            </div>
        </div>
    )
}