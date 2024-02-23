import { PetFetchData } from "../../../validators/pet-validators";

export const generatePetFetchQuery = (data: PetFetchData) => {
    const whereBlock = [
        data.nameQuery !== undefined ? `LOWER(name) LIKE LOWER(%\'${data.nameQuery}\'%)` : '',
        data.type !== undefined ? `type_id = \'${data.type}\'` : '',
        data.sex !== undefined ? `sex = ${data.sex}` : '',
        data.owner !== undefined ? `id IN (SELECT pet_id FROM pet_own WHERE owner_id = ${data.owner})` : '',
    ].filter(string => string !== '').join(',')

    return whereBlock.length === 0 ? '' : `--sql
        SELECT A.id FROM pet A JOIN pet_type B ON type_id = B.id
        ${whereBlock}
        ORDER BY ${data.orderBy} ${data.orderMode}
        LIMIT ${data.limit} OFFSET ${data.offset}`
}