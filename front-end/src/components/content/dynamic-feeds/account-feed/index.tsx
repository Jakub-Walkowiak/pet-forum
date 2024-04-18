import getAccounts from '@/helpers/feed-generators/get-accounts';
import AccountFetchOptions from '@/helpers/fetch-options/account-fetch-options';
import DynamicFeed from '..';
import UserPanel from '../../user/user-panel';

interface AccountFeedProps {
    options?: AccountFetchOptions,
}

export default function AccountFeed({ options }: AccountFeedProps) {
    return <DynamicFeed generator={getAccounts} generatorOptions={options} mapper={id => (
        <li key={id}><UserPanel id={id}/></li>
    )}/>
}