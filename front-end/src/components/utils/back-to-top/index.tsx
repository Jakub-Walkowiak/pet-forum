'use client'

import { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai'

interface BackToTopProps {
  threshold: number
}

export default function BackToTop({ threshold }: BackToTopProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(document.documentElement.scrollTop > threshold)
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return (
    <div
      data-testid='back-to-top'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`${!show && 'scale-0'} cursor-pointer hover:bg-emerald-500 duration-200 fixed bottom-6 right-6 bg-emerald-600 rounded-full w-14 h-14 text-5xl flex justify-center items-center`}
    >
      <AiFillCaretUp className='relative bottom-1' />
    </div>
  )
}
