import showNotificationPopup from "@/helpers/show-notification-popup"

export default async function postOwner(account: number, pet: number, onSuccess?: () => void) {
    const response = await fetch(`http://localhost:3000/pets/${pet}/owners`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: account }),
        credentials: 'include',
    })

    if (response.status === 404) showNotificationPopup(false, 'Either pet or user do not exist')
    else if (response.status === 403) showNotificationPopup(false, 'You do not own this pet')
    else if (response.ok) {
        showNotificationPopup(true, 'Owner added')
        document.dispatchEvent(new CustomEvent('refreshpet'))
        if (onSuccess) onSuccess()
    } else showNotificationPopup(false, 'Encountered server error')
}