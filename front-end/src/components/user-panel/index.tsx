import useProfile from "@/hooks/use-profile";
import FollowButton from "../follow-button";
import ProfilePicture from "../images/profile-picture";
import AccountLabel from "../labels/account-label";

interface UserPanelProps {
    id: number,
}

export default function UserPanel({ id }: UserPanelProps) {
    const data = useProfile(id)

    return (
        <div className="flex p-4 justify-between">
            {data === undefined 
                ? <p className="inset-0 m-auto">Failed to fetch account data</p>
                : <>
                    <div className="flex gap-4">
                        <ProfilePicture profileData={data} sizeOverride={3.5}/>
                        <div className="flex flex-col">
                            <div className="gap-2 flex">
                                <AccountLabel text={data.displayName} displayName size="large"/>
                                <AccountLabel text={data.accountName} size="large"/>
                            </div>
                            <p className="break-all">{data.bio}</p>
                        </div>
                    </div>
                    <div className="flex-0 inset-y-0 my-auto"><FollowButton id={id} followed={data.followed}/></div>
                </>}
        </div>
    )
}