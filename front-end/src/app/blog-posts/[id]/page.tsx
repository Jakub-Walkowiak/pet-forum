'use client'

import BlogFeed from "@/components/blog-feed";
import BlogPostGroup from "@/components/blog-post-group";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { id: number } }) {
    const [created, setCreated] = useState(new Array<number>())

    if (!isNaN(params.id)) return (
        <div className="divide-y divide-zinc-700">
            <div><BlogPostGroup rootId={params.id} rootMaximized afterReply={id => setCreated(old => [id, ...old])}/></div>

            {created.length > 0 && <ul className="divide-y divide-zinc-700">{created.map(id => (
                <li key={id}><BlogPostGroup rootId={id} hideParentButton/></li>
            ))}</ul>}

            <BlogFeed hideParentButton options={{ replyTo: params.id }}/>
        </div>
    )
    else notFound()
}
