import AccountFetchOptions from '../fetch-options/account-fetch-options'

export default async function* getAccounts(options?: AccountFetchOptions) {
  let offset = options?.offset === undefined ? 0 : options.offset
  const queryBody =
    options === undefined
      ? `limit=10`
      : [
          options.limit ? `limit=${options.limit}` : 'limit=10',
          options.orderBy ? `orderBy=${options.orderBy}` : '',
          options.orderMode ? `orderMode=${options.orderMode}` : '',
          options.contains ? `contains=${options.contains}` : '',
          options.relatedTo ? `relatedTo=${options.relatedTo}` : '',
          options.relationType ? `relationType=${options.relationType}` : '',
          options.followsPet ? `followsPet=${options.followsPet}` : '',
        ]
          .filter((str) => str !== '')
          .join('&')

  while (true) {
    const response = await fetch(`http://localhost:3000/accounts?offset=${offset}&` + queryBody, {
      credentials: 'include',
    })

    if (response.ok) {
      const json = (await response.json()) as Array<number>

      if (json.length > 0) {
        yield json
        offset += json.length
      } else yield undefined
    } else yield undefined
  }
}
