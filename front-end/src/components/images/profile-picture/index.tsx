import useImageUrl from '@/hooks/use-image-url';
import { ProfileData } from '@/hooks/use-profile';
import Image from 'next/image';
import { useId } from 'react';

interface ProfilePictureProps {
    profileData: ProfileData,
    sizeOverride?: number,
}

export default function ProfilePicture({ profileData, sizeOverride }: ProfilePictureProps) {
    const id = useId()
    const imageUrl = useImageUrl(profileData.profilePictureId)

    return imageUrl !== undefined
        ? <Image id={id} src={imageUrl} alt={`Profile picture of user ${profileData.accountName}`} className={`rounded-full ${sizeOverride === undefined && 'w-12 h-12'}`} width={400} height={400} style={{ width: `${sizeOverride}px`, height: `${sizeOverride}px` }}/>
        : <div className='rounded-full w-full h-full bg-emerald-600' style={{ width: `${sizeOverride}px`, height: `${sizeOverride}px` }}/>
}