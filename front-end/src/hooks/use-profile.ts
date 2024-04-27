import { useEffect, useState } from 'react'

export interface ProfileData {
    accountName: string,
    displayName: string,
    followerCount: number,
    accountsFollowedCount: number,
    dateCreated: string,
    blogPostCount: number,
    replyCount: number,
    ownedPetCount: number,
    profilePictureId?: number,
    bio?: string,
    followed: boolean,
    likesVisible: boolean,
}

export default function useProfile(id: number | undefined) {
    const [profileData, setProfileData] = useState<ProfileData>()

    const getProfileData = () => {
        const fetchData = async () => {
            if (!id) setProfileData(undefined)
            else {
                const res = await fetch(`http://localhost:3000/accounts/${id}`, { 
                    credentials: 'include' 
                })
                if (!res.ok) setProfileData(undefined) 
                else setProfileData(await res.json())
            }
        }
        try { fetchData() } catch (err) { setProfileData(undefined) }
    }

    useEffect(getProfileData, [id])
    useEffect(() => {
        document.addEventListener('refreshprofile', getProfileData)
        return () => document.removeEventListener('refreshprofile', getProfileData)
    }, [])

    return profileData
}