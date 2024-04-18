import PostImages from "@/components/images/post-images";
import ProfilePicture from "@/components/images/profile-picture";
import AccountLabel from "@/components/labels/account-label";
import TagLabel from "@/components/labels/tag-label";
import TimeLabel from "@/components/labels/time-label";
import showNotificationPopup from "@/helpers/show-notification-popup";
import stopEvent from "@/helpers/stop-event";
import useAuth from "@/hooks/use-auth";
import useBlogPost, { BlogPostData } from "@/hooks/use-blog-post";
import useProfile from "@/hooks/use-profile";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import BlogPostError from "../blog-post-error";

interface BlogPostBodyProps {
    data: BlogPostData,
    handleLike: VoidFunction,
    handleUnlike: VoidFunction,
    showReplyCreator: (accountName: string) => void,
    maximized?: boolean,
}

export default function BlogPostBody({ data, handleLike, handleUnlike, showReplyCreator, maximized = false }: BlogPostBodyProps) {
    const [clientLike, setClientLike] = useState(data.liked)
    const [likeTimeout, setLikeTimeout] = useState<NodeJS.Timeout>()
    const profileData = useProfile(data.posterId)
    const auth = useAuth()

    const replyTo = useBlogPost(data.replyTo)
    const replyToPoster = useProfile(replyTo?.posterId)

    useEffect(() => setClientLike(data.liked), [data])

    const onClick = () => {
        if (!auth) {
            showNotificationPopup(false, 'Login to like posts')
            return
        }

        setClientLike(!clientLike)
        clearTimeout(likeTimeout)
        setLikeTimeout(setTimeout(() => {
            if (data.liked === clientLike) data.liked ? handleUnlike() : handleLike()
        }, 350))
    }

    if (profileData !== undefined) return (
        <>
            {maximized 
                ? <div className="flex gap-4">
                    <ProfilePicture userId={data.posterId} sizeOverride={4} profileData={profileData}/>
                    <div className="flex flex-col gap-x-1 col-span-7">
                        <AccountLabel displayName size="large" text={profileData.displayName}/>
                        <AccountLabel size="large" text={profileData.accountName}/>
                    </div>
                </div> 
                : <ProfilePicture userId={data.posterId} profileData={profileData}/>}

            <div className="w-full flex flex-col">
                {!maximized && <div className="grid grid-cols-8 gap-1">
                    <div className="items-center flex flex-wrap gap-x-1 w-full col-span-7">
                        <AccountLabel displayName text={profileData.displayName}/>
                        <AccountLabel text={profileData.accountName}/>
                    </div>
                    
                    <div className="col-span-1"><TimeLabel date={new Date(data.datePosted)}/></div>
                </div>}

                {replyTo && <div className={`grid grid-cols-1 w-full text-emerald-700 font-medium truncate ${maximized ? 'text-base' : 'text-sm'}`}>
                    <div className="max-w-full font-medium truncate text-sm">to @{replyToPoster !== undefined ? replyToPoster.accountName : '[could not find]'}</div>
                </div>}
                {!maximized && <div className="h-1"/>}

                <div className={`mb-3 ${maximized ? 'text-lg' : 'text-base'} break-all`}>{data.contents}</div>

                {data.tags.length > 0 && <ul className="flex gap-2 flex-wrap list-none mb-4">
                    {data.tags.map(id => (
                        <li className={maximized ? '*:text-base' : ''} key={id}><TagLabel tagId={id}/></li>
                    ))}
                </ul>}

                {data.images.length > 0 && <PostImages imageIds={data.images}/>}

                <div className="flex gap-3 text-zinc-500 font-medium">
                    <div className={`${!clientLike ? 'hover:text-white' : 'text-red-600 hover:text-red-700'} ${maximized ? 'text-lg' : 'text-base'} cursor-pointer duration-200 flex gap-1 items-center`} onClick={e => { stopEvent(e); onClick() }}>
                        {!clientLike
                            ? <AiOutlineHeart className={maximized ? 'text-2xl' : 'text-xl'}/>
                            : <AiFillHeart className={maximized ? 'text-2xl' : 'text-xl'}/>}
                        {data.likeCount + (clientLike === data.liked ? 0 : clientLike ? 1 : -1)} {maximized && 'Likes'}
                    </div>
                    <div className={`${maximized ? 'text-lg' : 'text-base'}  cursor-pointer duration-200 hover:text-white flex gap-1 items-center`} onClick={e => { stopEvent(e); showReplyCreator(profileData.accountName) }}>
                        <AiOutlineMessage className={maximized ? 'text-2xl' : 'text-xl'}/>{data.replyCount} {maximized && 'Replies'}
                    </div>
                    {maximized && <div className="flex-1"><TimeLabel date={new Date(data.datePosted)} mode='datetime'/></div>}
                </div>
            </div>
        </>
    )
    else return <BlogPostError/>
}