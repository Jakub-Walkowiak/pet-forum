'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

interface DynamicFeedOption<T> {
    generator: (options: T) => AsyncGenerator<number[] | undefined, void, unknown>,
    generatorOptions: T,
    mapper: (id: number) => React.ReactNode,
}

export default function DynamicFeed<T>({ generator, generatorOptions, mapper }: DynamicFeedOption<T>) {
    const [currentGenerator, setCurrentGenerator] = useState(generator(generatorOptions))
    const loading = useRef(false)
    const [visualLoading, setVisualLoading] = useState(false)
    const [items, setItems] = useState(new Array<number>())

    const fetch = useCallback(async () => {
        const newPosts = (await currentGenerator.next()).value
        if (Array.isArray(newPosts)) setItems(old => {
            const oldLen = old.length
            const replacement = [...old.filter(id => !newPosts.includes(id)), ...newPosts]
            if (replacement.length === oldLen && newPosts.length !== 0) fetch()
            return replacement
        })
    }, [currentGenerator])

    const update = useCallback(async () => {
        if (!loading.current) {
            loading.current = true
            setVisualLoading(true)
            await fetch()
            loading.current = false
            setVisualLoading(false)
        }
    }, [fetch])

    const tryExtendFeed = useCallback(() => {
        if (document.documentElement.scrollHeight - document.documentElement.clientHeight - document.documentElement.scrollTop < 1) update()
    }, [update])

    useEffect(() => { 
        update()
        window.addEventListener('scroll', tryExtendFeed)
        return () => window.removeEventListener('scroll', tryExtendFeed)
    }, [tryExtendFeed, update])

    useEffect(() => setCurrentGenerator(generator(generatorOptions)), [generatorOptions, generator])
    useEffect(() => setItems([]), [currentGenerator])
    useEffect(() => tryExtendFeed(), [items, tryExtendFeed])

    return (
        <ul className='w-full flex flex-col list-none divide-y divide-zinc-700'>
            {items.map(mapper)}
            {visualLoading
                ? <li className='w-full flex items-center justify-center h-32 mt-1 text-5xl'><AiOutlineLoading className='animate-spin'/></li>
                : <li className='w-full flex items-center justify-center h-32 mt-1 text-xl text-gray-500'>Nothing too see here...</li>}
        </ul>
    )
}