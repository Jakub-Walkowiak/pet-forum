'use client'

import BlogFeed from "@/components/dynamic-feeds/blog-feed";
import BlogPostSearchPanel from "@/components/form-utils/feed-search-panels/blog-post-search-panel";
import { BlogPostFetchValidator } from "@/helpers/fetch-options/blog-post-fetch-options";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PageBody() {
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

export default function Page() {
    return (
        <Suspense>
            <PageBody/>
        </Suspense>
    )
}