import ProfilePicture from '@/components/profile-picture'
import useProfile from '@/hooks/use-profile'
import { useState } from 'react'
import PanelPopup from './panel-popup'

interface LoggedInProps {
    authId: number,
}

export default function LoggedIn({ authId }: LoggedInProps) {
    const profileData = useProfile(authId)
    const [showPopup, setShowPopup] = useState(false)

    if (profileData !== undefined) return (
        <div className={`duration-200 cursor-pointer z-10 flex gap-4 p-4 m-2 items-center justify-center h-fit hover:bg-gray-800 relative ${showPopup ? 'bg-gray-800 rounded-b-lg' : 'rounded-lg overflow-hidden'}`} 
            onClick={() => setShowPopup(!showPopup)}>
            <PanelPopup show={showPopup}/>
            <div className='z-10 h-full aspect-square'>{<ProfilePicture profileData={profileData}/>}</div>
            <div className='z-10 w-fit h-fit'>
                <p className='font-medium text-md'>{profileData.displayName}</p>
                <p className='font-normal text-sm text-zinc-500'>@{profileData.accountName}</p>
            </div>
        </div>
    ) 
    else return (
        <div className='flex gap-2 p-4 rounded-lg m-2 font-medium justify-center'>Failed to load profile...</div>
    )
}