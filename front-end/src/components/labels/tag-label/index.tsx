'use client'

import useTag from '@/hooks/use-tag'
import TagLikeLabel from '../tag-like-label'

interface TagLabelProps {
    tagId: number,
    onClickReplacement?: (e: React.MouseEvent) => void,
    size?: 'small' | 'large',
}

export default function TagLabel({ tagId, onClickReplacement, size = 'small' }: TagLabelProps) {
    const data = useTag(tagId)
    
    return <TagLikeLabel 
        text={data?.tagName} 
        redirectDestination={`/blog-posts?tags=[${tagId}]`} 
        onClickReplacement={onClickReplacement}
        notFoundText='Tag not found'
        size={size}
    />
}