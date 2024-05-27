'use client'

import usePetType from '@/hooks/use-pet-type'
import TagLikeLabel from '../tag-like-label'

interface PetTypeLabel {
    typeId: number,
    onClickReplacement?: (e: React.MouseEvent) => void,
    size?: 'small' | 'large',
}

export default function PetTypeLabel({ typeId, onClickReplacement, size = 'small' }: PetTypeLabel) {
    const data = usePetType(typeId)

    return <TagLikeLabel 
        text={data?.typeName} 
        redirectDestination={`/pets?type=${typeId}`} 
        onClickReplacement={onClickReplacement}
        notFoundText='Type not found'
        size={size}
    />
}