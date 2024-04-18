'use client'

import useTag from '@/hooks/use-tag';
import { useRouter } from 'next/navigation';

interface TagLabelProps {
    tagId: number,
}

export default function TagLabel({ tagId }: TagLabelProps) {
    const data = useTag(tagId)
    const router = useRouter()

    const handleClick = (e: React.BaseSyntheticEvent) => {
        e.stopPropagation()
        router.replace(`/blog-posts?tags=[${tagId}]`)
    }

    if (data !== undefined) return <div onClick={handleClick} className='cursor-pointer rounded-full py-0.5 px-2 bg-emerald-900 text-emerald-200 text-sm duration-200 hover:opacity-80'>{data.tagName}</div>
    else return <div className='rounded-full py-0.5 px-2 bg-red-800 text-red-400'>Tag not found</div>
}