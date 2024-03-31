import PostImages from "@/components/images/post-images";
import ProfilePicture from "@/components/images/profile-picture";
import TagLabel from "@/components/tag-label";
import TimeLabel from "@/components/time-label";
import { BlogPostData } from "@/hooks/use-blog-post";
import useProfile from "@/hooks/use-profile";
import { AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import BlogPostError from "../blog-post-error";

interface BlogPostBodyProps {
    data: BlogPostData,
}

export default function BlogPostBody({ data }: BlogPostBodyProps) {
    const profileData = useProfile(data.posterId)

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

                <div className="flex gap-2 items-center text-zinc-500 font-medium">
                    <AiOutlineHeart className="text-xl"/>{data.likeCount}
                    <AiOutlineMessage className="text-xl"/>{data.replyCount}
                </div>
            </div>
        </>
    )
    else return <BlogPostError/>
}