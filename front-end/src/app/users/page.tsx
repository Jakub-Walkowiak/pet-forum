'use client'

import AccountFeed from '@/components/content/dynamic-feeds/account-feed'
import AccountSearchPanel from '@/components/forms/utils/feed-search-panels/account-search-panel'
import { AccountFetchValidator } from '@/helpers/fetch-options/account-fetch-options'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function PageBody() {
  const params = useSearchParams()
  const [options, setOptions] = useState(AccountFetchValidator.parse(Object.fromEntries(params.entries())))

  useEffect(() => setOptions(AccountFetchValidator.parse(Object.fromEntries(params.entries()))), [params])

  return (
    <>
      <div className='w-full p-2 border-b border-zinc-700'>
        <AccountSearchPanel onSave={(options) => setOptions(options)} defaults={options} />
      </div>
      <AccountFeed options={options} />
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
