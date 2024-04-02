'use client'

import BlogFeed from "@/components/blog-feed";
import NewPostPanel from "@/components/new-post-panel";
import TabContainer from "@/components/tab-container";
import useAuth from "@/hooks/use-auth";


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
