'use client'

import BlogPostGroup from '@/components/content/blog-post-group'
import PostCreator from '@/components/forms/utils/post-creator'

import { useState } from 'react'

export default function NewPostPanel() {
  const [created, setCreated] = useState(new Array<number>())

  return (
    <>
      <div className='w-full min-h-16 border-b border-zinc-700 flex items-center justify-center p-4'>
        <PostCreator
          maxRows={8}
          placeholder='What do you want to share?'
          afterSubmit={(id) => setCreated((old) => [id, ...old])}
        />
      </div>
      {created.length > 0 && (
        <ul className='w-full flex flex-col list-none divide-y divide-zinc-700 border-b border-zinc-700'>
          {created.map((id) => (
            <li key={id}>
              <BlogPostGroup rootId={id} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
