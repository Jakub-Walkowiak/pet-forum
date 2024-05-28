'use client'

import AccountProfilePicture from '@/components/images/profile-picture/account'
import AccountLabel from '@/components/labels/account-label'
import TimeLabel from '@/components/labels/time-label'
import ValueAndText from '@/components/labels/value-and-text'
import AccountFollowButton from '@/components/utils/follow-button/account'
import useAuth from '@/hooks/use-auth'
import useProfile from '@/hooks/use-profile'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AiFillInfoCircle, AiOutlineInfoCircle } from 'react-icons/ai'

interface UserHeaderProps {
    id: number,
    setLikesTab?: Dispatch<SetStateAction<boolean>>,
}

export default function UserHeader({ id, setLikesTab }: UserHeaderProps) {
    const data = useProfile(id)
    const auth = useAuth()
    const router = useRouter()

    const [showStats, setShowStats] = useState(false)
    const [clientFollow, setClientFollow] = useState(false)

    useEffect(() => { 
        if (data !== undefined) if (setLikesTab) setLikesTab(data.likesVisible || (!data.likesVisible && auth === id))
    }, [data, auth, id, setLikesTab])

    const redirectFollowers = () => router.push(`/users?relationType=followers&relatedTo=${id}`)
    const redirectFollowedAccounts = () => router.push(`/users?relationType=followed&relatedTo=${id}`)
    const redirectFollowedPets = () => router.push(`/pets?followedBy=${id}`)
    const redirectOwnedPets = () => router.push(`/pets?owner=${id}`)

    if (data === undefined) return (
        <div className='flex items-center justify-center text-2xl font-semibold'>Encountered error fetching profile</div>
    )
    else return (
        <div className='w-full'>
            <div className='w-full aspect-[13/3] bg-emerald-800'/>
            <div className='w-full relative flex p-2 gap-2'>
                <div className='bg-gray-900 rounded-full p-1 w-fit relative -top-12 flex-shrink-0'>
                    <AccountProfilePicture id={id} sizeOverride={10}/>
                </div>
                <div className='flex flex-col'>
                    <AccountLabel id={id} text={data.displayName} size='extra_large' displayName/>
                    <AccountLabel id={id} text={data.accountName} size='extra_large'/>
                    <div className='break-all relative top-4 text-gray-200'>{data.bio}</div>
                </div>
                <div className='absolute top-36 left-3'><AccountFollowButton id={id} followed={data.followed} onChange={setClientFollow}/></div>
            </div>

            <div className='flex px-3 py-4 items-end gap-3'>
                <ValueAndText className='text-lg' value={data.followerCount + (clientFollow === data.followed ? 0 : clientFollow ? 1 : -1)} text='Followers' onClick={redirectFollowers}/>
                <ValueAndText className='text-lg' value={data.ownedPetCount} text='Pets owned' onClick={redirectOwnedPets}/>

                {showStats
                    ? <AiFillInfoCircle className='text-xl inset-y-0 my-auto cursor-pointer hover:text-gray-500 duration-200' onClick={() => setShowStats(false)}/>
                    : <AiOutlineInfoCircle className='text-xl text-gray-500 inset-y-0 my-auto cursor-pointer hover:text-white duration-200' onClick={() => setShowStats(true)}/>}

                <div className='flex-1 flex justify-end h-fit'>
                    <TimeLabel mode='date' date={new Date(data.dateCreated)} prefix='Joined'/>
                </div>
            </div>

            <div className={`${!showStats ? 'h-0' : 'h-14 xs:h-16 sm:h-10'} text-sm xs:text-base overflow-hidden duration-200`}>
                <div className={`p-2 grid grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 grid-flow-col overflow-hidden bg-black/20`}>
                    <ValueAndText value={data.blogPostCount} text='Blog posts'/>
                    <ValueAndText value={data.replyCount} text='Replies'/>
                    <ValueAndText value={data.accountsFollowedCount} text='Accs. followed' onClick={data.followedVisible || id === auth ? redirectFollowedAccounts : undefined}/>
                    <ValueAndText value={data.petsFollowedCount} text='Pets followed' onClick={data.followedVisible || id === auth ? redirectFollowedPets : undefined}/>
                </div>
            </div>
        </div>
    )
}