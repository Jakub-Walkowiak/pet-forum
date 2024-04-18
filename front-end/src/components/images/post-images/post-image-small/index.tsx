'use client'

import useImageUrl from '@/hooks/use-image-url';
import Image from 'next/image';
import PostImageError from '../post-image-error';

interface PostImageSmallProps {
    imageId: number,
}

export default function PostImageSmall({ imageId }: PostImageSmallProps) {
    const url = useImageUrl(imageId)

    return (
        <div className='w-full h-full'>
            {url !== undefined
                ? <Image src={url} alt='Image option under post' className='object-cover rounded-lg' fill/>
                : <PostImageError/>}
        </div>
    )
}