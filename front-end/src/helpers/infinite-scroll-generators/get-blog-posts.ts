import BlogPostFetchOptions from '../fetch-options/blog-post-fetch-options'

export default async function* getBlogPosts(options?: BlogPostFetchOptions) {
    let offset = options?.offset === undefined ? 0 : options.offset
    const queryBody = options === undefined 
        ? `limit=10` 
        : [options.limit ? `limit=${options.limit}` : 'limit=10',
            options.orderBy ? `orderBy=${options.orderBy}` : '',
            options.orderMode ? `orderMode=${options.orderMode}` : '',
            options.fromUser ? `fromUser=${options.fromUser}` : '', 
            options.replies !== undefined ? `replies${options.replies ? '=1' : ''}` : '', 
            options.replyTo ? `replyTo=${options.replyTo}` : '', 
            options.desiredUsers ? `desiredUsers=${options.desiredUsers}` : '', 
            options.tagMode ? `tagMode=${options.tagMode}` : '', 
            options.contains ? `contains=${options.contains}` : '', 
            options.petMode ? `petMode=${options.petMode}` : '', 
            options.tags && options.tags.length > 0 ? options.tags.map(tag => `tags[]=${tag}`).join('&') : '',
            options.pets && options.pets.length > 0 ? options.pets.map(pet => `pets[]=${pet}`).join('&') : '',
            options.likedBy ? `likedBy=${options.likedBy}` : '',
        ].filter(str => str !== '').join('&')

    while (true) {
        const response = await fetch(`http://localhost:3000/blog-posts?offset=${offset}&` +  queryBody, { credentials: 'include' })

        if (response.ok) {
            const json = (await response.json()) as { id: number }[]
            if (json.length > 0) {
                yield json.map(row => Number(row.id))
                offset += json.length
            } else yield undefined
        } else yield undefined
    }
}