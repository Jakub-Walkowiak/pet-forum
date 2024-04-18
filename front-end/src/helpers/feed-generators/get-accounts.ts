import AccountFetchOptions from '../fetch-options/account-fetch-options'

export default async function* getAccounts(options?: AccountFetchOptions) {
    let offset = options?.offset === undefined ? 0 : options.offset
    const queryBody = options === undefined 
        ? `limit=10` 
        : [options.limit ? `limit=${options.limit}` : 'limit=10',
            options.orderBy ? `orderBy=${options.orderBy}` : '',
            options.orderMode ? `orderMode=${options.orderMode}` : '',
            options.contains ? `contains=${options.contains}` : '',
            options.relatedTo ? `relatedTo=${options.relatedTo}` : '',
            options.relationType ? `relationType=${options.relationType}` : '',
        ].filter(str => str !== '').join('&')

    while (true) {
        const response = await fetch(`http://localhost:3000/accounts?offset=${offset}&` +  queryBody, { credentials: 'include' })

        if (response.ok) {
            const json = (await response.json()) as { id: number }[]
            if (json.length > 0) {
                yield json.map(row => Number(row.id))
                offset += json.length
            } else yield undefined
        } else yield undefined
    }
}