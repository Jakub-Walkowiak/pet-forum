'use client'

import PostCreator from '@/components/utils/form-utils/post-creator'
import showNotificationPopup from '@/helpers/show-notification-popup'
import useBlogPost from '@/hooks/use-blog-post'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { GroupArgs } from '..'
import BlogPostBody from './blog-post-body'
import BlogPostError from './blog-post-error'

interface BlogPostProps {
    id: number,
    groupArgs?: GroupArgs,
    hideParentButton?: boolean,
    afterReply?: (id: number) => void,
}

export default function BlogPost({ id, groupArgs, hideParentButton = false, afterReply }: BlogPostProps) {
    const [replyCreator, setReplyCreator] = useState(false)
    const [posterAccountName, setPosterAccountName] = useState('')
    const [hideConnection, setHideConnection] = useState(false)
    const router = useRouter()
    const postData = useBlogPost(id)

    const likePost = async () => {
        try {
            const response = await fetch(`http://localhost:3000/blog-posts/${id}/likes`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
            }).catch(err => { throw err })

            if (!response.ok) showNotificationPopup(false, 'Failed to like')
            else document.dispatchEvent(new CustomEvent('refreshblogpost'))
        } catch (err) { showNotificationPopup(false, 'Failed to like') }
    }

    const unlikePost = async () => {
        try {
            const response = await fetch(`http://localhost:3000/blog-posts/${id}/likes`, {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) showNotificationPopup(false, 'Failed to unlike')
            else document.dispatchEvent(new CustomEvent('refreshblogpost'))
        } catch (err) { showNotificationPopup(false, 'Failed to unlike') }
    }

    const handleShowReply = (accountName: string) => {
        setReplyCreator(!replyCreator)
        setPosterAccountName(accountName)
        setHideConnection(!hideConnection)
    }

    const handleAfterReply = (createdId: number) => {
        setReplyCreator(false)
        setHideConnection(!hideConnection)
        if (groupArgs && !groupArgs.rootMaximized) groupArgs.setPosts(old => [...old.slice(0, groupArgs.index + 1), createdId])
        if (afterReply) afterReply(createdId)
        document.dispatchEvent(new CustomEvent('refreshblogpost'))
    }

    const handleRedirect = () => {
        if (postData && (!groupArgs?.rootMaximized || (groupArgs?.rootMaximized && groupArgs.index !== groupArgs.length - 1))) router.push(`/blog-posts/${id}`)
    }

    return (
        <div className='w-full h-fit flex flex-col relative'>
            {groupArgs && groupArgs.index < groupArgs.length - 1 && !hideConnection &&  <>
                <div className='absolute cursor-pointer left-[26px] top-12 w-6 h-full peer' onClick={() => groupArgs.setPosts(old => old.slice(groupArgs.index + 1))}/>
                <div className='absolute -z-10 left-[38px] top-12 w-1 h-full bg-emerald-800 peer-hover:bg-red-700 duration-200'/>
            </>}

            {groupArgs && !hideParentButton && postData && postData.replyTo && groupArgs.index === 0 && <>
                <div className='h-3'></div>
                <div onClick={() => groupArgs.setPosts(old => [postData.replyTo as number, ...old])} className='absolute top-0 w-full h-6 from-emerald-900/50 flex items-center justify-center text-4xl text-gray-400 hover:text-5xl hover:text-white hover:bg-gradient-to-b cursor-pointer duration-200'>
                    <AiOutlineEllipsis/>
                </div>
            </>}

            <div className={`w-full h-fit p-4 gap-4 flex ${groupArgs?.rootMaximized && groupArgs.index === groupArgs.length - 1 && 'flex-col'} ${postData && (!groupArgs?.rootMaximized || (groupArgs?.rootMaximized && groupArgs.index !== groupArgs.length - 1)) && 'cursor-pointer hover:bg-black/10 duration-200'}`} onClick={handleRedirect}>
                {postData
                    ? <BlogPostBody data={postData} handleLike={likePost} handleUnlike={unlikePost} showReplyCreator={handleShowReply} maximized={groupArgs?.rootMaximized && groupArgs.index === groupArgs.length - 1}/>
                    : <BlogPostError/>}
            </div>

            {postData && replyCreator && <div className='p-4 pt-0'>
                <PostCreator placeholder={`Replying to @${posterAccountName}`} replyTo={id} maxRows={5} afterSubmit={handleAfterReply}/>    
            </div>}
        </div>
    )
}