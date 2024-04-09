'use client'

import BlogFeed from "@/components/blog-feed";
import BlogPostSearchPanel from "@/components/blog-post-search-panel";
import { BlogPostFetchValidator } from "@/helpers/fetch-options/blog-post-fetch-options";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const params = useSearchParams()
    const [options, setOptions] = useState(BlogPostFetchValidator.parse(Object.fromEntries(params.entries())))

    useEffect(() => setOptions(BlogPostFetchValidator.parse(Object.fromEntries(params.entries()))), [params])

    return (
        <>
            <div className="w-full p-2 border-b border-zinc-700">
                <BlogPostSearchPanel onSave={options => setOptions(options)} defaults={options}/>
            </div>
            <BlogFeed options={options}/>
        </>
    )
}