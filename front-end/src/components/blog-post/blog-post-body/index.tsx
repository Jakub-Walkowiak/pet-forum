import PostImages from "@/components/images/post-images";
import ProfilePicture from "@/components/images/profile-picture";
import TagLabel from "@/components/tag-label";
import TimeLabel from "@/components/time-label";
import showNotificationPopup from "@/helpers/show-notification-popup";
import useBlogPost, { BlogPostData } from "@/hooks/use-blog-post";
import useProfile from "@/hooks/use-profile";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import BlogPostError from "../blog-post-error";
import useAuth from "@/hooks/use-auth";

interface BlogPostBodyProps {
    data: BlogPostData,
    handleLike: VoidFunction,
    handleUnlike: VoidFunction,
    showReplyCreator: (accountName: string) => void,
}

export default function BlogPostBody({ data, handleLike, handleUnlike, showReplyCreator }: BlogPostBodyProps) {
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
            <ProfilePicture profileData={profileData}/>
            <div className="w-full flex flex-col">
                <div className="grid grid-cols-8 gap-1">
                    <div className="items-center flex flex-wrap gap-x-1 w-full col-span-7">
                        <span title={profileData.displayName} className='flex-none truncate font-medium text-md max-w-full white'>{profileData.displayName}</span>
                        <span title={`@${profileData.accountName}`} className='flex-none font-normal text-sm text-zinc-500 max-w-full truncate'>@{profileData.accountName}</span>
                    </div>
                    
                    <div className="col-span-1"><TimeLabel date={new Date(data.datePosted)}/></div>
                </div>

                {replyTo && <div className="grid grid-cols-1 w-full text-emerald-700 font-medium truncate text-sm">
                    <div className="max-w-full font-medium truncate text-sm">to @{replyToPoster !== undefined ? replyToPoster.accountName : '[could not find]'}</div>
                </div>}
                <div className="h-1"/>

                <div className="mb-3">{data.contents}</div>

                {data.tags.length > 0 && <ul className="flex gap-2 flex-wrap list-none mb-4">
                    {data.tags.map(id => (
                        <li key={id}><TagLabel tagId={id}/></li>
                    ))}
                </ul>}

                {data.images.length > 0 && <PostImages imageIds={data.images}/>}

                <div className="flex gap-3 text-zinc-500 font-medium">
                    <div className={`${!clientLike ? 'hover:text-white' : 'text-red-600 hover:text-red-700'} cursor-pointer duration-200 flex gap-1 items-center`} onClick={onClick}>
                        {!clientLike
                            ? <AiOutlineHeart className="text-xl"/>
                            : <AiFillHeart className="text-xl"/>}
                        {data.likeCount + (clientLike === data.liked ? 0 : clientLike ? 1 : -1)}
                    </div>
                    <div className="cursor-pointer duration-200 hover:text-white flex gap-1 items-center" onClick={() => showReplyCreator(profileData.accountName)}>
                        <AiOutlineMessage className="text-xl"/>{data.replyCount}
                    </div>
                </div>
            </div>
        </>
    )
    else return <BlogPostError/>
}