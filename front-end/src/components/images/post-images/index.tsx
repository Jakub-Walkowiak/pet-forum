'use client'

import { useState } from 'react'
import PostImageMain from './post-image-main'
import PostImageSmall from './post-image-small'

interface PostImagesProps {
  imageIds: Array<number>
}

export default function PostImages({ imageIds }: PostImagesProps) {
  const [selected, setSelected] = useState(imageIds[0])

  return (
    <div className='w-full flex flex-col gap-3 mb-3 max-w-xl relative'>
      <PostImageMain imageId={selected} />
      {imageIds.length > 1 && (
        <>
          <ul
            onClick={(e) => e.stopPropagation()}
            className='cursor-default bottom-2 absolute w-full flex gap-3 list-none overflow-x-auto h-20 bg-gray-800 p-2 rounded-lg border border-zinc-700'
          >
            {imageIds.map((id) => (
              <li
                onClick={() => setSelected(id)}
                className={`flex-none relative w-24 duration-200 cursor-pointer ${selected !== id && 'opacity-60 hover:opacity-100'}`}
                key={id}
              >
                <PostImageSmall imageId={id} />
              </li>
            ))}
          </ul>
          <div className='h-24' />
        </>
      )}
    </div>
  )
}
