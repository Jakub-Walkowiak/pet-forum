'use client'

import BlogFeed from '@/components/content/dynamic-feeds/blog-feed'
import UserHeader from '@/components/content/user/user-header'
import TabContainer from '@/components/layout/tab-container'
import { notFound } from 'next/navigation'
import { useState } from 'react'

export default function Page({ params }: { params: { id: number } }) {
  const [likesTab, setLikesTab] = useState(false)

  if (!isNaN(params.id))
    return (
      <div className='divide-y divide-zinc-700'>
        <UserHeader id={Number(params.id)} setLikesTab={setLikesTab} />
        <TabContainer
          tabs={[
            {
              title: 'Posts',
              element: (
                <BlogFeed
                  options={{ fromUser: params.id, orderBy: 'date_posted', orderMode: 'DESC', replies: false }}
                />
              ),
            },
            {
              title: 'Replies',
              element: (
                <BlogFeed options={{ fromUser: params.id, orderBy: 'date_posted', orderMode: 'DESC', replies: true }} />
              ),
            },
            ...(likesTab
              ? [
                  {
                    title: 'Likes',
                    element: <BlogFeed options={{ likedBy: params.id, orderBy: 'date_liked', orderMode: 'DESC' }} />,
                  },
                ]
              : []),
          ]}
        />
      </div>
    )
  else notFound()
}
