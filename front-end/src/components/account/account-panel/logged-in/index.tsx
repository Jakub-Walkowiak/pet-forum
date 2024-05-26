'use client'

import AccountProfilePicture from '@/components/images/profile-picture/account'
import AccountLabel from '@/components/labels/account-label'
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
        <div className={`z-10 flex duration-200 cursor-pointer gap-4 p-4 m-2 items-center justify-center h-fit max-w-72 hover:bg-gray-800 relative ${showPopup ? 'bg-gray-800 rounded-b-lg' : 'rounded-lg'}`} 
            onClick={() => setShowPopup(!showPopup)}>
            <PanelPopup show={showPopup}/>
            <div className='h-12 aspect-square'>{<AccountProfilePicture id={authId}/>}</div>
            <div className='h-fit max-w-52 flex flex-col'>
                <AccountLabel id={authId} text={profileData.displayName} displayName/>
                <AccountLabel id={authId} text={profileData.accountName}/>
            </div>
        </div>
    ) 
    else return (
        <div className='flex gap-2 p-4 rounded-lg m-2 font-medium justify-center'>Failed to load profile...</div>
    )
}