import UploaderImages from '@/components/forms/utils/image-uploader-wrapper/uploader-images'
import { PetSex } from '@/helpers/fetch-options/pet-fetch-options'
import { z } from 'zod'
import postOwner from './post-owner'

export const PatchPetInputsValidator = z.object({
  name: z.string().trim().max(50, { message: 'Max. name length is 50 chars' }).optional(),
  type: z.union([z.string(), z.number()]).optional(),
  sex: z.nativeEnum(PetSex).optional(),
  owners: z.number().array().optional(),
})

export type PatchPetInputs = z.infer<typeof PatchPetInputsValidator>

export default async function patchPet(id: number, images: UploaderImages, data: PatchPetInputs) {
  const imagesPromise = images.upload()
  const ownerPromises = data.owners?.map((owner) => postOwner(owner, id))

  const ownersSuccess = (await Promise.all(ownerPromises ? ownerPromises : [])).every((response) => response.ok)

  if (typeof data.type === 'string') {
    const response = await fetch('http://localhost:3000/pets/types', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: data.type }),
      credentials: 'include',
    })
    data.type = (await response.json()).id as number
  }

  const imagesResponse = await imagesPromise
  if (images.urls.length !== 0) {
    if (imagesResponse === undefined) throw new Error('Upload error')
    else if (!imagesResponse.ok) return false
  }

  const pfpId: number | undefined = imagesResponse !== undefined ? (await imagesResponse.json())[0].id : undefined
  const reqBody = { sex: data.sex, profilePictureId: pfpId, type: data.type, name: data.name }

  return {
    response: fetch(`http://localhost:3000/pets/${id}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
      credentials: 'include',
    }),
    ownersSuccess,
  }
}
