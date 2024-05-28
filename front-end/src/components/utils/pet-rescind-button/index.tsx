'use client'

import Button from "@/components/forms/utils/button"
import rescindOwnership from "@/helpers/fetch-helpers/pet/rescind-ownership"
import showConfirmModal from "@/helpers/show-confirm-modal"
import showNotificationPopup from "@/helpers/show-notification-popup"
import { useState } from "react"

interface PetRescindButtonProps {
    id: number,
    soleOwner: boolean,
}

export default function PetRescindButton({ id, soleOwner }: PetRescindButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (!await showConfirmModal('Are you sure you wish to rescind ownership of this pet?\n\n This action cannot be undone', 'Rescind')) return
        setLoading(true)

        try { rescindOwnership(id) }
        catch (err) { showNotificationPopup(false, 'Error contacting server') }
        finally { setLoading(false) }
    }

    return <Button 
        className="bg-red-500 w-full"
        disabled={soleOwner}
        text={soleOwner ? 'No other owners' : 'Rescind ownership'}
        onClickHandler={handleClick}
        loading={loading}
    />
}