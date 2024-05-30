'use client'

import PetFeed from '@/components/content/dynamic-feeds/pet-feed'
import PetSearchPanel from '@/components/forms/utils/feed-search-panels/pet-search-panel'
import { PetFetchValidator } from '@/helpers/fetch-options/pet-fetch-options'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function PageBody() {
  const params = useSearchParams()
  const [options, setOptions] = useState(PetFetchValidator.parse(Object.fromEntries(params.entries())))

  useEffect(() => setOptions(PetFetchValidator.parse(Object.fromEntries(params.entries()))), [params])

  return (
    <>
      <div className='w-full p-2 border-b border-zinc-700'>
        <PetSearchPanel onSave={(options) => setOptions(options)} defaults={options} />
      </div>
      <PetFeed options={options} />
    </>
  )
}

export default function Page() {
  return (
    <Suspense>
      <PageBody />
    </Suspense>
  )
}
