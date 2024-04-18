'use client'

import BlogFeed from '@/components/content/dynamic-feeds/blog-feed';
import NewPostPanel from '@/components/layout/new-post-panel';
import TabContainer from '@/components/layout/tab-container';
import useAuth from '@/hooks/use-auth';


export default function Home() {
    const auth = useAuth()

    return (
        <>
            {auth ? <TabContainer header={<NewPostPanel/>} tabs={[
                { title: 'Discover', element: <BlogFeed options={{ replies: false, orderBy: 'like_count' }}/> },
                { title: 'Followed', element: <BlogFeed options={{ desiredUsers: 'followed', orderBy: 'date_posted' }}/> },
            ]}/> : <BlogFeed options={{ replies: false, orderBy: 'like_count' }}/>}
        </>
    )
}
