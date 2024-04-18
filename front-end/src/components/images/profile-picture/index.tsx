'use client'

import stopEvent from '@/helpers/stop-event'
import useImageUrl from '@/hooks/use-image-url'
import { ProfileData } from '@/hooks/use-profile'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useId } from 'react'

interface ProfilePictureProps {
    profileData: ProfileData,
    userId: number,
    sizeOverride?: number,
}

export default function ProfilePicture({ profileData, sizeOverride, userId }: ProfilePictureProps) {
    const id = useId()
    const imageUrl = useImageUrl(profileData.profilePictureId)
    const router = useRouter()

    const doRedirect = (e: React.BaseSyntheticEvent) => {
        stopEvent(e)
        router.push(`/users/${userId}`)
    }

    return imageUrl !== undefined
        ? <Image onClick={doRedirect} id={id} src={imageUrl} alt={`Profile picture of user ${profileData.accountName}`} className={`duration-200 hover:opacity-75 cursor-pointer rounded-full ${sizeOverride === undefined && 'w-12 h-12'}`} width={400} height={400} style={{ width: `${sizeOverride}rem`, height: `${sizeOverride}rem` }}/>
        : <div onClick={doRedirect} className={`duration-200 hover:opacity-75 cursor-pointer flex-shrink-0 rounded-full bg-emerald-600 ${sizeOverride === undefined && 'w-12 h-12'}`} style={{ width: `${sizeOverride}rem`, height: `${sizeOverride}rem` }}/>
}