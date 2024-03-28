'use client'

import useAuth from "@/hooks/use-auth";
import PostCreator from "../form-utils/post-creator";

export default function NewPostPanel() {
    const auth = useAuth()

    return (
        <div className={`${auth === undefined && 'hidden'} w-full min-h-16 sticky border-b border-zinc-700 flex items-center justify-center p-4`}>
            <PostCreator maxRows={8} placeholder="What do you want to share?"/>
        </div>
    )
}