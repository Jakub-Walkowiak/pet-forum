import BlogPostGroup from "@/components/blog-post-group";
import getBlogPosts from "@/helpers/feed-generators/get-blog-posts";
import BlogPostFetchOptions from "@/helpers/fetch-options/blog-post-fetch-options";
import DynamicFeed from "..";

interface BlogFeedProps {
    options?: BlogPostFetchOptions,
    hideParentButton?: boolean,
}

export default function BlogFeed({ options, hideParentButton }: BlogFeedProps) {
    return <DynamicFeed generator={getBlogPosts} generatorOptions={options} mapper={id => (
        <li key={id}><BlogPostGroup hideParentButton={hideParentButton} rootId={id}/></li>
    )}/>
}