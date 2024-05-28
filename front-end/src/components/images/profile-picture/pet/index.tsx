import usePet from "@/hooks/use-pet"
import ProfilePicture from ".."

interface PetProfilePictureProps {
    id: number,
    sizeOverride?: number,
    onClickReplacement?: () => void,
}

export default function PetProfilePicture({ id, sizeOverride, onClickReplacement }: PetProfilePictureProps) {
    const data = usePet(id)
    return <ProfilePicture onClick={onClickReplacement} redirectDestination={onClickReplacement ? '' : `/pets/${id}`} pictureId={data?.profilePictureId} sizeOverride={sizeOverride}/>
}