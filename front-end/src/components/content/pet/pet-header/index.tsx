'use client'

import AccountProfilePicture from '@/components/images/profile-picture/account'
import PetProfilePicture from '@/components/images/profile-picture/pet'
import PetLabel from '@/components/labels/pet-label'
import PetSexLabel from '@/components/labels/pet-sex-label'
import PetTypeLabel from '@/components/labels/pet-type-label'
import TimeLabel from '@/components/labels/time-label'
import ValueAndText from '@/components/labels/value-and-text'
import PetFollowButton from '@/components/utils/follow-button/pet'
import usePet from '@/hooks/use-pet'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PetHeaderProps {
  id: number
}

export default function PetHeader({ id }: PetHeaderProps) {
  const data = usePet(id)
  const router = useRouter()

  const [clientFollow, setClientFollow] = useState(false)

  const redirectFollowers = () => router.push(`/users?followsPet=${id}`)

  if (data === undefined)
    return (
      <div className='flex items-center justify-center text-2xl font-semibold'>
        Encountered error fetching pet profile
      </div>
    )
  else
    return (
      <div className='w-full'>
        <div className='w-full aspect-[13/3] bg-emerald-800' />
        <div className='w-full relative flex p-2 gap-2'>
          <div className='bg-gray-900 rounded-full p-1 w-fit relative -top-12 flex-shrink-0'>
            <PetProfilePicture id={id} sizeOverride={10} />
          </div>
          <div className='flex flex-col'>
            <div className='flex'>
              <PetLabel id={id} text={data.name} size='extra_large' />
              <div className='w-min self-center ms-2 flex gap-2'>
                <PetTypeLabel typeId={data.typeId} size='large' />
                <PetSexLabel sex={data.sex} size='large' />
              </div>
            </div>
            <span className='text-lg text-zinc-500'>{data.owners.length > 1 ? 'Owners:' : 'Owner:'}</span>
            <ul className='flex gap-1'>
              {data.owners.map((id) => (
                <li key={id}>
                  <AccountProfilePicture id={id} sizeOverride={2.5} />
                </li>
              ))}
            </ul>
          </div>
          <div className='absolute top-36 left-3'>
            <PetFollowButton id={id} followed={data.followed} onChange={setClientFollow} owned={data.owned} />
          </div>
        </div>

        <div className='flex px-3 py-4 items-end gap-3'>
          <ValueAndText
            className='text-lg'
            value={data.followerCount + (clientFollow === data.followed ? 0 : clientFollow ? 1 : -1)}
            text='Followers'
            onClick={redirectFollowers}
          />
          <ValueAndText className='text-lg' value={data.featureCount} text='Posts featured in' />

          <div className='flex-1 flex justify-end h-fit'>
            <TimeLabel mode='date' date={new Date(data.dateCreated)} prefix='Joined' />
          </div>
        </div>
      </div>
    )
}
