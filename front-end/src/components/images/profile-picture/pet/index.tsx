import usePet from "@/hooks/use-pet"
import ProfilePicture from ".."

interface PetProfilePictureProps {
    id: number,
    sizeOverride?: number,
}

export default function PetProfilePicture({ id, sizeOverride }: PetProfilePictureProps) {
    const data = usePet(id)
    return <ProfilePicture redirectDestination={`/pets/${id}`} pictureId={data?.profilePictureId} sizeOverride={sizeOverride}/>
}