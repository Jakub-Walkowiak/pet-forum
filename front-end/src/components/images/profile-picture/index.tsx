import useImageUrl from '@/hooks/use-image-url';
import { ProfileData } from '@/hooks/use-profile';
import Image from 'next/image';

interface ProfilePictureProps {
    profileData: ProfileData,
}

export default function ProfilePicture({ profileData }: ProfilePictureProps) {
    const imageUrl = useImageUrl(profileData.profilePictureId)
    return imageUrl !== undefined
        ? <Image src={imageUrl} alt={`Profile picture of user ${profileData.accountName}`} className='rounded-full w-12 h-12' width={400} height={400}/>
        : <div className='rounded-full w-12 h-12 bg-emerald-600'/>
}