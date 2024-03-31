import useBlogPost from "@/hooks/use-blog-post";
import BlogPostBody from "./blog-post-body";
import BlogPostError from "./blog-post-error";

interface BlogPostProps {
    postId: number,
}

export default function BlogPost({ postId }: BlogPostProps) {
    const postData = useBlogPost(postId)

    return (
        <div className={`w-full h-fit p-4 gap-4 flex`}>
            {postData !== undefined
                ? <BlogPostBody data={postData} />
                : <BlogPostError/>}
        </div>
    )
}