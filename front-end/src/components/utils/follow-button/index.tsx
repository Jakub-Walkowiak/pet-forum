'use client'

import Button from '@/components/forms/utils/button'
import useAuth from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

interface FollowButtonProps {
    followed?: boolean,
    onChange?: (clientFollow: boolean) => void,
    handleFollow: () => void,
    handleUnfollow: () => void,
    disabledChecker: (auth: number) => boolean,
}

export default function FollowButton({ followed = false, onChange, handleFollow, handleUnfollow, disabledChecker }: FollowButtonProps) {
    const auth = useAuth()

    const [clientFollow, setClientFollow] = useState(followed)
    const [followTimeout, setFollowTimeout] = useState<NodeJS.Timeout>()

    useEffect(() => setClientFollow(followed), [followed])
    useEffect(() => { if (onChange) onChange(clientFollow) }, [clientFollow, onChange])

    const handleFollowClick = () => {
        setClientFollow(!clientFollow)
        clearTimeout(followTimeout)
        setFollowTimeout(setTimeout(() => {
            if (clientFollow === followed) followed ? handleUnfollow() : handleFollow()
        }, 350))
    }

    return <Button className='w-40 h-10' 
        text={auth !== undefined ? (!clientFollow ? 'Follow' : 'Unfollow') : 'Login to follow'} 
        disabled={auth === undefined || disabledChecker(auth)} 
        dark={clientFollow} 
        onClickHandler={handleFollowClick}/>
}