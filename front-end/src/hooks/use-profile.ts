import { useEffect, useState } from 'react';

export interface ProfileData {
    accountName: string,
    displayName: string,
    followerCount: number,
    followedCount: number,
    dateCreated: string,
    runningResponseScore: number,
    netPositiveResponses: number,
    netNegativeResponses: number,
    bestResponses: number,
    blogPostCount: number,
    replyCount: number,
    adviceCount: number,
    responseCount: number,
    ownedPetCount: number,
    profilePicture: number,
}

export default function useProfile(id: number) {
    const [profileData, setProfileData] = useState<ProfileData>()

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:3000/accounts/${id}`)
            if (!res.ok) setProfileData(undefined) 
            else setProfileData(await res.json())
        }
        try { fetchData() } catch (err) { setProfileData(undefined) }
    }, [id])    

    return profileData
}