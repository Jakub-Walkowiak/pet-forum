import { Dispatch, SetStateAction, useState } from "react";
import BlogPost from "../blog-post";

interface BlogPostGroupProps {
    startId: number,
}

export interface GroupArgs {
    index: number,
    length: number,
    setPosts: Dispatch<SetStateAction<number[]>>,
}

export default function BlogPostGroup({ startId }: BlogPostGroupProps) {
    const [posts, setPosts] = useState([startId,])

    return <>{posts.map((id, idx) => (
        <li key={id}><BlogPost id={id} groupArgs={{ index: idx, length: posts.length, setPosts }}/></li>
    ))}</>
}