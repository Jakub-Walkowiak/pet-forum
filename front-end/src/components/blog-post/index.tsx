import showNotificationPopup from "@/helpers/show-notification-popup";
import useBlogPost from "@/hooks/use-blog-post";
import BlogPostBody from "./blog-post-body";
import BlogPostError from "./blog-post-error";

interface BlogPostProps {
    postId: number,
}

export default function BlogPost({ postId }: BlogPostProps) {
    const postData = useBlogPost(postId)

    const likePost = async () => {
        try {
            const response = await fetch(`http://localhost:3000/blog-posts/${postId}/likes`, {
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
            const response = await fetch(`http://localhost:3000/blog-posts/${postId}/likes`, {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) showNotificationPopup(false, 'Failed to unlike')
            else document.dispatchEvent(new CustomEvent('refreshblogpost'))
        } catch (err) { showNotificationPopup(false, 'Failed to unlike') }
    }
    
    return (
        <div className={`w-full h-fit p-4 gap-4 flex`}>
            {postData !== undefined
                ? <BlogPostBody data={postData} handleLike={likePost} handleUnlike={unlikePost}/>
                : <BlogPostError/>}
        </div>
    )
}