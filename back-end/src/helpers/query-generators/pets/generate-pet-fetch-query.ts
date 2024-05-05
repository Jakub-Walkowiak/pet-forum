import { PetSex } from '../../../types/pet-types'
import { PetFetchData } from '../../../validators/pet-validators'

export const generatePetFetchQuery = (data: PetFetchData) => {
    const whereBlock = [
        data.nameQuery !== undefined ? `LOWER(name) LIKE LOWER(%\'${data.nameQuery}\'%)` : '',
        data.type !== undefined ? `type_id = \'${data.type}\'` : '',
        data.sex !== undefined 
            ? data.sex !== PetSex.NOT_APPLICABLE 
                ? `sex = ${data.sex}` 
                : 'sex = n/a'
            : '',
        data.owner !== undefined ? `A.id IN (SELECT pet_id FROM pet_own WHERE owner_id = ${data.owner})` : '',
        data.followedBy !== undefined ? `follower_id = ${data.followedBy}` : '',
    ].filter(str => str !== '').join(',')

    return whereBlock.length === 0 ? '' : `--sql
        SELECT A.id 
        FROM pet A 
            ${data.type !== undefined ? 'JOIN pet_type B ON type_id = B.id' : ''}
            ${data.followedBy ? 'JOIN pet_follow C ON pet_id = A.id' : ''}
        ${whereBlock.length > 0 ? `WHERE ${whereBlock}` : ''}
        ORDER BY ${data.orderBy} ${data.orderMode}
        LIMIT ${data.limit} OFFSET ${data.offset}`
}