import { PetEditData } from '../../../validators/pet-validators'

export const generatePetEditQuery = (data: PetEditData, pet: string) => {
    const setBlock = [
        data.name !== undefined ? `name = \'${data.name}\'` : '',
        data.type !== undefined ? `type_id = \'${data.type}\'` : '',
        data.sex !== undefined ? `sex = \'${data.sex}\'` : '',
        data.profilePictureId !== undefined ? `profile_picture_id = ${data.profilePictureId}` : '',
    ]
        .filter((string) => string !== '')
        .join(',')

    return setBlock.length === 0
        ? ''
        : `--sql
        UPDATE pet
        ${setBlock.length > 0 ? `SET ${setBlock}` : ''}
        WHERE id = ${pet}`
}
