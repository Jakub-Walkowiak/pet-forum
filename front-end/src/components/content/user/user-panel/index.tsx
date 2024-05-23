'use client'

import AccountProfilePicture from '@/components/images/profile-picture/account'
import AccountLabel from '@/components/labels/account-label'
import AccountFollowButton from '@/components/utils/follow-button/account'
import useProfile from '@/hooks/use-profile'

interface UserPanelProps {
    id: number,
}

export default function UserPanel({ id }: UserPanelProps) {
    const data = useProfile(id)

    return (
        <div className='flex p-4 justify-between'>
            {data === undefined 
                ? <p className='inset-0 m-auto'>Failed to fetch account data</p>
                : <>
                    <div className='flex gap-4'>
                        <AccountProfilePicture id={id} sizeOverride={3.5}/>
                        <div className='flex flex-col'>
                            <AccountLabel id={id} text={data.displayName} displayName size='large'/>
                            <AccountLabel id={id} text={data.accountName} size='large'/>
                            <p className='break-all'>{data.bio}</p>
                        </div>
                    </div>
                    <div className='flex-0 inset-y-0 my-auto'><AccountFollowButton id={id} followed={data.followed}/></div>
                </>}
        </div>
    )
}