import PostImages from "@/components/images/post-images";
import ProfilePicture from "@/components/images/profile-picture";
import TagLabel from "@/components/tag-label";
import TimeLabel from "@/components/time-label";
import { BlogPostData } from "@/hooks/use-blog-post";
import useProfile from "@/hooks/use-profile";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import BlogPostError from "../blog-post-error";

interface BlogPostBodyProps {
    data: BlogPostData,
    handleLike: VoidFunction,
    handleUnlike: VoidFunction,
}

export default function BlogPostBody({ data, handleLike, handleUnlike }: BlogPostBodyProps) {
    const [clientLike, setClientLike] = useState(data.liked)
    const [likeTimeout, setLikeTimeout] = useState<NodeJS.Timeout>()
    const profileData = useProfile(data.posterId)

    useEffect(() => setClientLike(data.liked), [data])

    const onClick = () => {
        setClientLike(!clientLike)
        clearTimeout(likeTimeout)
        setLikeTimeout(setTimeout(() => {
            if (data.liked === clientLike) data.liked ? handleUnlike() : handleLike()
        }, 750))
    }

    if (profileData !== undefined) return (
        <>
            <ProfilePicture profileData={profileData}/>
            <div className="flex-1 flex flex-col">
                <div className="flex gap-1 items-between mb-1">
                    <div className="flex-1 flex gap-1 items-center">
                        <p className='font-medium text-md white truncate block'>{profileData.displayName}</p>
                        <p className='font-normal text-sm text-zinc-500 truncate block'>@{profileData.accountName}</p>
                    </div>
                    
                    <TimeLabel date={new Date(data.datePosted)}/>
                </div>

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
                    <div className="cursor-pointer duration-200 hover:text-white flex gap-1 items-center"><AiOutlineMessage className="text-xl"/>{data.replyCount}</div>
                </div>
            </div>
        </>
    )
    else return <BlogPostError/>
}