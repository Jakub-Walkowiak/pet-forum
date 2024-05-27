import UploaderImages from "@/components/forms/utils/image-uploader-wrapper/uploader-images"
import { z } from "zod"
import showNotificationPopup from "../../show-notification-popup"

export const PatchProfileInputsValidator = z
    .object({
        displayName: z.string().trim().max(50, { message: 'Max. name length is 50 chars' }).optional(),
        bio: z.string().trim().max(300, { message: 'Max bio length is 300 chars' }).optional(),
        likesVisible: z.boolean().optional(),
        followedVisible: z.boolean().optional(),
    })

export type PatchProfileInputs = z.infer<typeof PatchProfileInputsValidator>

export default async function patchProfile(images: UploaderImages, data: PatchProfileInputs, onSuccess?: () => void) {
    const imagesResponse = await images.upload()

    if (images.urls.length !== 0) {
        if (imagesResponse === undefined) throw new Error('Upload error')
        else if (!imagesResponse.ok) {
            showNotificationPopup(false, 'Failed to upload image')
            return
        }
    }

    const pfpId: number | undefined = imagesResponse !== undefined
        ? (await imagesResponse.json())[0].id
        : undefined
    const reqBody = { displayName: data.displayName, profilePictureId: pfpId, bio: data.bio, likesVisible: data.likesVisible, followedVisible: data.followedVisible }

    const response = await fetch('http://localhost:3000/accounts', {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody),
        credentials: 'include',
    })

    if (response.status === 404) showNotificationPopup(false, 'Couldn\'t set your profile picture')
    else if (response.ok) {
        showNotificationPopup(true, 'Changes saved')
        document.dispatchEvent(new CustomEvent('refreshprofile'))
        if (onSuccess) onSuccess()
    } else showNotificationPopup(false, 'Encountered server error')
}