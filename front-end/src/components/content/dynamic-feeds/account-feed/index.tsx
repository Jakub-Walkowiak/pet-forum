import AccountFetchOptions from '@/helpers/fetch-options/account-fetch-options'
import getAccounts from '@/helpers/infinite-scroll-generators/get-accounts'
import DynamicFeed from '..'
import UserPanel from '../../user/user-panel'

interface AccountFeedProps {
    options?: AccountFetchOptions,
}

export default function AccountFeed({ options }: AccountFeedProps) {
    return <DynamicFeed generator={getAccounts} generatorOptions={options} mapper={id => (
        <li key={id}><UserPanel id={id}/></li>
    )}/>
}