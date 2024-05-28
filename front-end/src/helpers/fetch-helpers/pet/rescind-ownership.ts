import showNotificationPopup from "@/helpers/show-notification-popup"

export default async function rescindOwnership(pet: number, onSuccess?: () => void) {
    const response = await fetch(`http://localhost:3000/pets/${pet}/owners/rescind`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
    })

    if (response.status === 403) showNotificationPopup(false, 'You do not own this pet')
    else if (response.ok) {
        showNotificationPopup(true, 'Ownership rescinded')
        document.dispatchEvent(new CustomEvent('refreshpet'))
        if (onSuccess) onSuccess()
    } else showNotificationPopup(false, 'Encountered server error')
}