'use client'

import stopEvent from '@/helpers/stop-event'
import useImageUrl from '@/hooks/use-image-url'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useId } from 'react'

interface ProfilePictureProps {
    pictureId?: number,
    redirectDestination?: string,
    sizeOverride?: number,
}

export default function ProfilePicture({ pictureId, sizeOverride, redirectDestination }: ProfilePictureProps) {
    const id = useId()
    const imageUrl = useImageUrl(pictureId)
    const router = useRouter()

    const doRedirect = (e: React.BaseSyntheticEvent) => {
        stopEvent(e)
        if (redirectDestination) router.push(redirectDestination)
    }

    return imageUrl !== undefined
        ? <Image onClick={doRedirect} 
            id={id} 
            src={imageUrl}
            alt='Profile picture'
            className={`${redirectDestination !== undefined && 'duration-200 hover:opacity-75 cursor-pointer'} rounded-full ${sizeOverride === undefined && 'w-12 h-12'}`} width={400} height={400} style={{ width: `${sizeOverride}rem`, height: `${sizeOverride}rem` }}/>
        : <div onClick={doRedirect} 
            className={`duration-200 hover:opacity-75 cursor-pointer flex-shrink-0 rounded-full bg-emerald-600 ${sizeOverride === undefined && 'w-12 h-12'}`} 
            style={{ width: `${sizeOverride}rem`, height: `${sizeOverride}rem` }}/>
}