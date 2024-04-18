'use client'

import showNotificationPopup from '@/helpers/show-notification-popup'
import useAuth from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import Button from '../form-utils/button'

interface FollowButtonProps {
    id: number,
    followed?: boolean,
    onChange?: (clientFollow: boolean) => void,
}

export default function FollowButton({ id, followed = false, onChange }: FollowButtonProps) {
    const auth = useAuth()

    const [clientFollow, setClientFollow] = useState(followed)
    const [followTimeout, setFollowTimeout] = useState<NodeJS.Timeout>()

    useEffect(() => setClientFollow(followed), [followed])
    useEffect(() => { if (onChange) onChange(clientFollow) }, [clientFollow, onChange])

    const handleUnfollow = async () => {
        try {
            const response = await fetch(`http://localhost:3000/accounts/${id}/follow`, {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include',
            }).catch(err => { throw err })

            if (!response.ok) showNotificationPopup(false, 'Failed to unfollow')
            else document.dispatchEvent(new CustomEvent('refreshprofile'))
        } catch (err) { showNotificationPopup(false, 'Failed to unfollow') }
    }

    const handleFollow = async () => {
        try {
            const response = await fetch(`http://localhost:3000/accounts/${id}/follow`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
            }).catch(err => { throw err })

            if (!response.ok) showNotificationPopup(false, 'Failed to follow')
            else document.dispatchEvent(new CustomEvent('refreshprofile'))
        } catch (err) { showNotificationPopup(false, 'Failed to follow') }
    }

    const handleFollowClick = () => {
        setClientFollow(!clientFollow)
        clearTimeout(followTimeout)
        setFollowTimeout(setTimeout(() => {
            if (clientFollow === followed) followed ? handleUnfollow() : handleFollow()
        }, 350))
    }

    return <Button className='w-40 h-10' 
        text={auth !== undefined ? (!clientFollow ? 'Follow' : 'Unfollow') : 'Login to follow'} 
        disabled={auth === undefined || auth === id} 
        dark={clientFollow} 
        onClickHandler={handleFollowClick}/>
}