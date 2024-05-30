'use client'

import AccountProfilePicture from '@/components/images/profile-picture/account'
import BlurOverlay from '@/components/utils/blur-overlay'
import useAuth from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import NavbarSideFull from '../navbar-side-full'

export default function NavbarTop() {
  const auth = useAuth()
  const [showBig, setShowBig] = useState(false)
  const [swipeXStart, setSwipeXStart] = useState<number>()

  const startSwipe = (e: TouchEvent) => setSwipeXStart(e.changedTouches[0].clientX)
  const endSwipe = (e: TouchEvent) => {
    if (swipeXStart === undefined) return
    const swipeXEnd = e.changedTouches[0].clientX
    if (showBig && swipeXEnd + 40 < swipeXStart) setShowBig(false)
    else if (!showBig && swipeXEnd - 40 > swipeXStart) setShowBig(true)
    setSwipeXStart(undefined)
  }

  useEffect(() => {
    document.addEventListener('touchstart', startSwipe)
    document.addEventListener('touchend', endSwipe)
    return () => {
      document.removeEventListener('touchstart', startSwipe)
      document.removeEventListener('touchend', endSwipe)
    }
  })

  return (
    <>
      <div className='w-full h-16 p-2 border-b border-zinc-700 text-5xl'>
        {auth ? (
          <AccountProfilePicture sizeOverride={3} id={auth} onClickReplacement={() => setShowBig(true)} />
        ) : (
          <AiOutlineMenu
            className='text-zinc-400 cursor-pointer duration-200 hover:opacity-70'
            onClick={() => setShowBig(true)}
          />
        )}
      </div>
      {showBig && <BlurOverlay onClick={() => setShowBig(false)} />}
      <div
        className={`text-[16px] fixed h-full w-fit top-0 left-0 z-20 p-2 bg-gray-900 duration-200 ${!showBig && '-translate-x-full'}`}
      >
        <NavbarSideFull />
      </div>
    </>
  )
}
