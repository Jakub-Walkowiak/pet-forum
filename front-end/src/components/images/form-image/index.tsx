'use client'

import Image from 'next/image'
import { MouseEventHandler, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import FullscreenImage from '../fullscreen-image'

interface FormImageProps {
  src: string
  remove: MouseEventHandler<SVGElement>
}

export default function FormImage({ src, remove }: FormImageProps) {
  const [fullImage, setFullImage] = useState(false)

  return (
    <div className={`relative h-12 w-12 sm:h-16 sm:w-16`}>
      <Image
        src={src}
        alt='Uploaded image'
        layout='fill'
        objectFit='cover'
        className={`rounded-lg hover:cursor-pointer`}
        onClick={() => setFullImage(true)}
      />
      <AiOutlineClose
        className='rounded-full p-px text-xl text-white bg-black/60 absolute right-1 top-1 hover:cursor-pointer'
        onClick={remove}
      />

      {fullImage && <FullscreenImage src={src} hide={() => setFullImage(false)} />}
    </div>
  )
}
