'use client'

import stopEvent from '@/helpers/stop-event'
import { useRouter } from 'next/navigation'
import React from 'react'

interface TagLikeLabel {
  text?: string
  size?: 'small' | 'large'
  redirectDestination?: string
  onClickReplacement?: (e: React.MouseEvent) => void
  notFoundText?: string
}

export default function TagLikeLabel({
  text,
  redirectDestination,
  onClickReplacement,
  size = 'small',
  notFoundText = 'Not found',
}: TagLikeLabel) {
  const router = useRouter()

  const sizeStyle = () => {
    switch (size) {
      case 'small':
        return 'text-sm'
      case 'large':
        return 'text-lg'
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    stopEvent(e)
    if (onClickReplacement) onClickReplacement(e)
    else if (redirectDestination) router.push(redirectDestination)
  }

  if (text !== undefined)
    return (
      <div
        onClick={handleClick}
        className={`cursor-pointer rounded-full py-0.5 px-2 bg-emerald-900 text-emerald-200 duration-200 hover:opacity-80 whitespace-nowrap ${sizeStyle()}`}
      >
        {text}
      </div>
    )
  else
    return (
      <div className={`rounded-full py-0.5 px-2 bg-red-800 text-red-400 whitespace-nowrap ${sizeStyle()}`}>
        {notFoundText}
      </div>
    )
}
