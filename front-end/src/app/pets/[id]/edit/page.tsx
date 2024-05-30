'use client'

import BlogFeed from '@/components/content/dynamic-feeds/blog-feed'
import PetHeaderEdit from '@/components/content/pet/pet-header/edit'
import TabContainer from '@/components/layout/tab-container'
import { notFound } from 'next/navigation'

export default function Page({ params }: { params: { id: number } }) {
  if (!isNaN(params.id))
    return (
      <div className='divide-y divide-zinc-700'>
        <PetHeaderEdit id={Number(params.id)} />
        <TabContainer
          tabs={[
            {
              title: 'Posts',
              element: (
                <BlogFeed options={{ pets: [params.id], orderBy: 'date_posted', orderMode: 'DESC', replies: false }} />
              ),
            },
            {
              title: 'Replies',
              element: (
                <BlogFeed options={{ pets: [params.id], orderBy: 'date_posted', orderMode: 'DESC', replies: true }} />
              ),
            },
          ]}
        />
      </div>
    )
  else notFound()
}
