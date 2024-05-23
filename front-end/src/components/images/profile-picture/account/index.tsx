import useProfile from "@/hooks/use-profile"
import ProfilePicture from ".."

interface AccountProfilePictureProps {
    id: number,
    sizeOverride?: number,
}

export default function AccountProfilePicture({ id, sizeOverride }: AccountProfilePictureProps) {
    const data = useProfile(id)
    return <ProfilePicture redirectDestination={`/users/${id}`} pictureId={data?.profilePictureId} sizeOverride={sizeOverride}/>
}