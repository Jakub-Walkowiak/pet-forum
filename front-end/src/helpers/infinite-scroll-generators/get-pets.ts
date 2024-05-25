import PetFetchOptions from '../fetch-options/pet-fetch-options'

export default async function* getPets(options?: PetFetchOptions) {
    let offset = options?.offset === undefined ? 0 : options.offset
    const queryBody = options === undefined 
        ? `limit=10` 
        : [options.limit ? `limit=${options.limit}` : 'limit=10',
            options.orderBy ? `orderBy=${options.orderBy}` : '',
            options.orderMode ? `orderMode=${options.orderMode}` : '',
            options.nameQuery ? `nameQuery=${options.nameQuery}` : '',
            options.sex ? `sex=${options.sex}` : '',
            options.followedBy ? `followedBy=${options.followedBy}` : '',
            options.owner ? `owner=${options.owner}` : '',
            options.type ? `type=${options.type}` : '',
        ].filter(str => str !== '').join('&')

    while (true) {
        const response = await fetch(`http://localhost:3000/pets?offset=${offset}&` +  queryBody, { credentials: 'include' })

        if (response.ok) {
            const json = await response.json()
            
            if (json.length > 0) {
                yield json
                offset += json.length
            } else yield undefined
        } else yield undefined
    }
}