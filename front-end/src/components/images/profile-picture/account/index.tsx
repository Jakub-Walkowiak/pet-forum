import useProfile from '@/hooks/use-profile'
import ProfilePicture from '..'

interface AccountProfilePictureProps {
  id: number
  sizeOverride?: number
  onClickReplacement?: () => void
}

export default function AccountProfilePicture({ id, sizeOverride, onClickReplacement }: AccountProfilePictureProps) {
  const data = useProfile(id)
  return (
    <ProfilePicture
      onClick={onClickReplacement}
      redirectDestination={onClickReplacement ? undefined : `/users/${id}`}
      pictureId={data?.profilePictureId}
      sizeOverride={sizeOverride}
    />
  )
}
