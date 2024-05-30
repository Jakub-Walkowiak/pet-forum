'use client'

import showNotificationPopup from '@/helpers/show-notification-popup'
import { useEffect, useId, useState } from 'react'
import UploaderImages, { ImageError } from './uploader-images'

interface ImageUploaderWrapperProps {
  render: (images: UploaderImages) => React.ReactNode
  maxCount?: number
  maxResX?: number
  maxResY?: number
  forceSquare?: boolean
  overrideOnMax?: boolean
}

export default function ImageUploaderWrapper({
  render,
  maxCount = 1,
  maxResX,
  maxResY,
  forceSquare = false,
  overrideOnMax = false,
}: ImageUploaderWrapperProps) {
  const [update, setUpdate] = useState(false)
  const [useDragStyle, setUseDragStyle] = useState(false)
  const [images] = useState(new UploaderImages(maxCount, forceSquare, maxResX, maxResY, overrideOnMax))

  const overlayId = useId()
  const wrapperId = useId()

  useEffect(() => setUpdate(false), [update])

  const handleLeave = (e: React.DragEvent<HTMLElement>) => {
    const targetId = (e.target as HTMLDivElement).id
    if (targetId === overlayId || targetId === wrapperId) setUseDragStyle(false)
  }

  const handleDrag = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    setUseDragStyle(true)
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    setUseDragStyle(false)

    const handleResponse = (response?: ImageError) => {
      if (response === ImageError.TooMany) showNotificationPopup(false, `Max number of images is ${images.maxCount}`)
      else if (response === ImageError.InvalidType) showNotificationPopup(false, `Unsupported file type`)
      setUpdate(true)
    }

    for (let i = 0; i < e.dataTransfer.files.length; ++i) {
      const currentFile = e.dataTransfer.files.item(i) as File
      images.add(currentFile).then(handleResponse)
    }
  }

  return (
    <div
      id={wrapperId}
      onDragLeave={handleLeave}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className='h-fit relative flex-1'
    >
      {useDragStyle && (
        <div
          id={overlayId}
          className='w-full h-full absolute top-0 left-0 z-[100] bg-emerald-950/20 outline-4 outline-dashed outline-emerald-700 rounded-lg -outline-offset-[12px]'
        />
      )}
      <object
        data={'placeholder-icon.svg'}
        className={`inset-x-0 inset-y-0 m-auto absolute stroke-emerald-700 w-12 ${!useDragStyle && 'hidden'}`}
      />
      {render(images)}
    </div>
  )
}
