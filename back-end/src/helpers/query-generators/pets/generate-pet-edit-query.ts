import { PetEditData } from '../../../validators/pet-validators'

export const generatePetEditQuery = (data: PetEditData, pet: string) => {
    const setBlock = [
        data.name !== undefined ? `name = \'${data.name}\'` : '',
        data.type !== undefined ? `type_id = \'${data.type}\'` : '',
        data.sex !== undefined ? `sex = ${data.sex}` : '',
    ].filter(string => string !== '').join(',')

    return setBlock.length === 0 ? '' : `--sql
        UPDATE pet
        ${setBlock}
        WHERE id = ${pet}`
}