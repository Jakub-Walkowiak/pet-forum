'use client'

import { useEffect, useState } from "react";
import BlogPost from "../blog-post";

export default function BlogFeed() {
    const [posts, setPosts] = useState(new Array<number>())

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('http://localhost:3000/blog-posts')
            setPosts(((await response.json()) as { id: number }[]).map(row => row.id))
        }

        fetchPosts()
    }, [])

    return (
        <ul className="w-full flex flex-col list-none divide-y divide-zinc-700">
            {posts.map(id => (
                <li key={id}><BlogPost postId={id}/></li>
            ))}
        </ul>
    )
}