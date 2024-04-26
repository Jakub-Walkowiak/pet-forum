import BlogPostFetchOptions from '@/helpers/fetch-options/blog-post-fetch-options'
import getBlogPosts from '@/helpers/infinite-scroll-generators/get-blog-posts'
import DynamicFeed from '..'
import BlogPostGroup from '../../blog-post-group'

interface BlogFeedProps {
    options?: BlogPostFetchOptions,
    hideParentButton?: boolean,
}

export default function BlogFeed({ options, hideParentButton }: BlogFeedProps) {
    return <DynamicFeed generator={getBlogPosts} generatorOptions={options} mapper={id => (
        <li key={id}><BlogPostGroup hideParentButton={hideParentButton} rootId={id}/></li>
    )}/>
}