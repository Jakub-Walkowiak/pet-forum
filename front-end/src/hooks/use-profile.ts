import { useCallback, useEffect, useState } from 'react'

export interface ProfileData {
  accountName: string
  displayName: string
  followerCount: number
  accountsFollowedCount: number
  dateCreated: string
  blogPostCount: number
  replyCount: number
  ownedPetCount: number
  profilePictureId?: number
  bio?: string
  followed: boolean
  likesVisible: boolean
  followedVisible: boolean
  petsFollowedCount: number
}

export default function useProfile(id: number | undefined) {
  const [profileData, setProfileData] = useState<ProfileData>()

  const getProfileData = useCallback(() => {
    const fetchData = async () => {
      if (!id) setProfileData(undefined)
      else {
        const res = await fetch(`http://localhost:3000/accounts/${id}`, {
          credentials: 'include',
        })
        if (!res.ok) setProfileData(undefined)
        else setProfileData(await res.json())
      }
    }
    try {
      fetchData()
    } catch (err) {
      setProfileData(undefined)
    }
  }, [id])

  useEffect(getProfileData, [id, getProfileData])
  useEffect(() => {
    document.addEventListener('refreshprofile', getProfileData)
    return () => document.removeEventListener('refreshprofile', getProfileData)
  }, [getProfileData])

  return profileData
}
