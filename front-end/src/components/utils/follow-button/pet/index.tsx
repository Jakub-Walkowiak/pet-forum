import showNotificationPopup from "@/helpers/show-notification-popup"
import FollowButton from ".."

interface PetFollowButtonProps {
    id: number,
    followed?: boolean,
    onChange?: (clientFollow: boolean) => void,
    owned: boolean,
}

export default function PetFollowButton({ id, followed = false, onChange, owned }: PetFollowButtonProps) {
    const handleUnfollow = async () => {
        try {
            const response = await fetch(`http://localhost:3000/pets/${id}/follow`, {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include',
            }).catch(err => { throw err })

            if (!response.ok) showNotificationPopup(false, 'Failed to unfollow')
            else document.dispatchEvent(new CustomEvent('refreshpet'))
        } catch (err) { showNotificationPopup(false, 'Failed to unfollow') }
    }

    const handleFollow = async () => {
        try {
            const response = await fetch(`http://localhost:3000/pets/${id}/follow`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
            }).catch(err => { throw err })

            if (!response.ok) showNotificationPopup(false, 'Failed to follow')
            else document.dispatchEvent(new CustomEvent('refreshpet'))
        } catch (err) { showNotificationPopup(false, 'Failed to follow') }
    }

    return <FollowButton followed={followed} onChange={onChange} handleFollow={handleFollow} handleUnfollow={handleUnfollow} disabledChecker={() => owned}/>
}