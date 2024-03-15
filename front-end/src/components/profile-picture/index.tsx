import useImageUrl from '@/hooks/use-image-url';
import { ProfileData } from '@/hooks/use-profile';
import Image from 'next/image';

interface ProfilePictureProps {
    profileData: ProfileData,
}

export default function ProfilePicture({ profileData }: ProfilePictureProps) {
    const imageUrl = useImageUrl(profileData.profilePicture)
    return imageUrl !== undefined
        ? <Image src={imageUrl} alt={`Profile picture of user ${profileData.accountName}`} className='rounded-full w-full h-full' width={100} height={100}/>
        : <div className='rounded-full w-full h-full bg-emerald-600'/>
}