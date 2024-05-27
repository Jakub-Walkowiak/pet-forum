'use client'

import AccountFeed from "@/components/content/dynamic-feeds/account-feed"
import BlogFeed from "@/components/content/dynamic-feeds/blog-feed"
import PetFeed from "@/components/content/dynamic-feeds/pet-feed"
import Input from "@/components/forms/utils/input"
import TabContainer from "@/components/layout/tab-container"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineSearch } from "react-icons/ai"

export default function Page() {
    const router = useRouter()

    const {
        register,
        getValues
    } = useForm<{ search: string }>()

    const [currentSearch, setCurrentSearch] = useState('')

    return (
        <>
            <form className="w-full p-2 relative border-b border-zinc-700" onSubmit={(e) => { e.preventDefault(); setCurrentSearch(getValues('search')) }}>
                <Input placeholder="What are you looking for?" register={register} name="search" className="w-full"/>
                <AiOutlineSearch className='absolute inset-y-0 my-auto right-4 text-gray-400 text-2xl cursor-pointer hover:text-white duration-200' onClick={() => setCurrentSearch(getValues('search'))}/>
            </form>
            <TabContainer tabs={[
                { title: 'Users', element: <AccountFeed options={{ contains: currentSearch }}/>, onDoubleClick: () => router.push('/users') },
                { title: 'Pets', element: <PetFeed options={{ nameQuery: currentSearch }}/>, onDoubleClick: () => router.push('/pets') },
                { title: 'Blog posts', element: <BlogFeed options={{ contains: currentSearch }}/>, onDoubleClick: () => router.push('/blog-posts') },
            ]}/>
        </>
    )
}