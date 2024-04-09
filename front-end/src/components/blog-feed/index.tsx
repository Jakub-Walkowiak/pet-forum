'use client'

import BlogPostFetchOptions from "@/helpers/fetch-options/blog-post-fetch-options";
import getBlogPosts from "@/helpers/get-posts";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import BlogPostGroup from "../blog-post-group";

interface BlogFeedProps {
    options?: BlogPostFetchOptions,
    hideParentButton?: boolean,
}

export default function BlogFeed({ options, hideParentButton = false }: BlogFeedProps) {
    const [postGenerator, setPostGenerator] = useState(getBlogPosts(options))
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState(new Array<number>())

    const fetchPosts = useCallback(async () => {
        const newPosts = (await postGenerator.next()).value
        if (Array.isArray(newPosts)) setPosts(old => [...old, ...newPosts])
    }, [postGenerator])

    useEffect(() => { 
        fetchPosts() 

        const handleScroll = async () => {
            if (document.documentElement.scrollHeight - document.documentElement.clientHeight - document.documentElement.scrollTop < 1) {
                setLoading(true)
                await fetchPosts()
                setLoading(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchPosts])

    useEffect(() => {
        setPosts([])
        setPostGenerator(getBlogPosts(options))
    }, [options])

    return (
        <ul className="w-full flex flex-col list-none divide-y divide-zinc-700">
            {posts.map(id => (
                <li key={id}><BlogPostGroup hideParentButton={hideParentButton} rootId={id}/></li>
            ))}
            {loading 
                ? <li className="w-full flex items-center justify-center h-32 mt-1 text-5xl"><AiOutlineLoading className="animate-spin"/></li>
                : <li className="w-full flex items-center justify-center h-32 mt-1 text-xl text-gray-500">Nothing too see here...</li>}
        </ul>
    )
}