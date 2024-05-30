'use clinet'

import useImageUrl from '@/hooks/use-image-url'
import Image from 'next/image'
import PostImageError from '../post-image-error'

interface PostImageMainProps {
  imageId: number
}

export default function PostImageMain({ imageId }: PostImageMainProps) {
  const url = useImageUrl(imageId)

  return (
    <div className='w-full'>
      {url !== undefined ? (
        <Image
          src={url}
          alt='Selected image under post'
          className='cursor-default object-contain rounded-lg h-auto w-full'
          width={0}
          height={0}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <PostImageError />
      )}
    </div>
  )
}
