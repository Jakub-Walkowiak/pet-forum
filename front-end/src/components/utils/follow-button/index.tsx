'use client'

import Button from '@/components/forms/utils/button'
import useAuth from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

interface FollowButtonProps {
  followed?: boolean
  onChange?: (clientFollow: boolean) => void
  handleFollow: () => void
  handleUnfollow: () => void
  altChecker: (auth: number) => boolean
  altClick?: () => void
  altText?: string
}

export default function FollowButton({
  followed = false,
  onChange,
  handleFollow,
  handleUnfollow,
  altChecker,
  altClick,
  altText,
}: FollowButtonProps) {
  const auth = useAuth()

  const [clientFollow, setClientFollow] = useState(followed)
  const [followTimeout, setFollowTimeout] = useState<NodeJS.Timeout>()

  useEffect(() => setClientFollow(followed), [followed])
  useEffect(() => {
    if (onChange) onChange(clientFollow)
  }, [clientFollow, onChange])

  const handleFollowClick = () => {
    setClientFollow(!clientFollow)
    clearTimeout(followTimeout)
    setFollowTimeout(
      setTimeout(() => {
        if (clientFollow === followed) followed ? handleUnfollow() : handleFollow()
      }, 350),
    )
  }

  const handleClick = () => {
    if (auth && altChecker(auth) && altClick) altClick()
    else handleFollowClick()
  }

  const getText = () => {
    if (auth === undefined) return 'Login to follow'
    else if (altChecker(auth) && altClick && altText) return altText
    else if (!clientFollow) return 'Follow'
    else return 'Unfollow'
  }

  return (
    <Button
      className='w-40 h-10'
      text={getText()}
      disabled={auth === undefined || (altChecker(auth) && !altClick)}
      dark={clientFollow}
      onClickHandler={handleClick}
    />
  )
}
