import UploaderImages from "@/components/forms/utils/image-uploader-wrapper/uploader-images"
import { z } from "zod"

export const PatchProfileInputsValidator = z
    .object({
        displayName: z.string().trim().max(50, { message: 'Max. name length is 50 chars' }).optional(),
        bio: z.string().trim().max(300, { message: 'Max bio length is 300 chars' }).optional(),
        likesVisible: z.boolean().optional(),
        followedVisible: z.boolean().optional(),
    })

export type PatchProfileInputs = z.infer<typeof PatchProfileInputsValidator>

export default async function patchProfile(images: UploaderImages, data: PatchProfileInputs) {
    const imagesResponse = await images.upload()

    if (images.urls.length !== 0) {
        if (imagesResponse === undefined) throw new Error('Upload error')
        else if (!imagesResponse.ok) return false
    }

    const pfpId: number | undefined = imagesResponse !== undefined
        ? (await imagesResponse.json())[0].id
        : undefined
    const reqBody = { displayName: data.displayName, profilePictureId: pfpId, bio: data.bio, likesVisible: data.likesVisible, followedVisible: data.followedVisible }

    return fetch('http://localhost:3000/accounts', {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody),
        credentials: 'include',
    })
}