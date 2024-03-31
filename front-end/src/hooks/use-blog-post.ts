import { useEffect, useState } from "react";

export interface BlogPostData {
    posterId: number,
    contents: string,
    likeCount: number,
    replyCount: number,
    datePosted: string,
    replyTo?: number,
    tags: Array<number>,
    images: Array<number>,
}

export default function useBlogPost(id: number) {
    const [data, setData] = useState<BlogPostData>()

    const getData = () => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/blog-posts/${id}`)
            if (!response.ok) setData(undefined)
            else setData(await response.json())
        }
        try { fetchData() } catch(err) { setData(undefined) }
    }

    useEffect(getData, [id])
    document.addEventListener('refreshblogpost', getData)

    return data
}