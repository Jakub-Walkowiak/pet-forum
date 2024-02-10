import { BlogPostFetchData } from "../validators/blog-post-validators";

export const generatePostFetchQuery = (data: BlogPostFetchData, fromUser: number | undefined) => {
    let orderByString = ''
    switch (data.orderBy) {
        case "LIKES": 
            orderByString = 'like_count'
            break
        case "DATE": 
            orderByString = 'date_posted'
            break
        case "REPLIES": 
            orderByString = 'reply_count'
            break
    }

    let userFilterString = ''
    if (data.desiredUsers === 'FOLLOWED') {
        userFilterString = `--sql
            poster_id IN (
                SELECT followed_id FROM follow WHERE follower_id = poster_id
            )`
    } else {
        userFilterString = `--sql
            poster_id IN (
                SELECT followed_id FROM follow WHERE follower_id = poster_id
            ) AND poster_id IN (
                SELECT follower_id FROM follow WHERE followed_id = poster_id
            )
        `
    }

    let tagFilter = ''
    if (data.tags) {
        if (data.tagMode === 'ANY') {
            tagFilter = `--sql
                id IN (
                    SELECT post_id FROM tagged
                    WHERE tag_id IN (${data.tags.join(',')})
                )`
        } else {
            tagFilter = data.tags.map(tag => `--sql
                id IN (
                    SELECT post_id FROM tagged
                    WHERE tag_id = ${tag}
                )
            `).join(' AND ')
        }
    }
    
    return `--sql
        SELECT id FROM blog_post
        WHERE 
            ${data.user !== undefined && `poster_id = \'${data.user}\'`}
            reply_to IS ${data.replies ? 'NOT NULL' : 'NULL'}
            ${userFilterString}
            ${tagFilter}
        ORDER BY ${orderByString} ${data.orderMode}
        LIMIT ${data.limit} OFFSET ${data.offset}`
}