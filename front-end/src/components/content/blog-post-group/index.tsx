'use client'

import { Dispatch, SetStateAction, useState } from 'react';
import BlogPost from './blog-post';

interface BlogPostGroupProps {
    rootId: number,
    hideParentButton?: boolean,
    rootMaximized?: boolean,
    afterReply?: (id: number) => void,
}

export interface GroupArgs {
    index: number,
    length: number,
    setPosts: Dispatch<SetStateAction<number[]>>,
    rootMaximized: boolean,
}

export default function BlogPostGroup({ rootId, rootMaximized = false, hideParentButton = false, afterReply }: BlogPostGroupProps) {
    const [posts, setPosts] = useState([rootId,])

    return <>{posts.map((id, idx) => (
        <BlogPost hideParentButton={hideParentButton} key={id} id={id} groupArgs={{ index: idx, length: posts.length, setPosts, rootMaximized }} afterReply={afterReply}/>
    ))}</>
}