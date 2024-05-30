'use client'

import { PetSex } from '@/helpers/fetch-options/pet-fetch-options'
import getPetSexName from '@/helpers/get-pet-sex-name'
import TagLikeLabel from '../tag-like-label'

interface PetSexLabelProps {
  sex: PetSex
  onClickReplacement?: (e: React.MouseEvent) => void
  size?: 'small' | 'large'
}

export default function PetSexLabel({ sex, onClickReplacement, size = 'small' }: PetSexLabelProps) {
  return (
    <TagLikeLabel
      text={getPetSexName(sex)}
      redirectDestination={`/pets?sex=${sex}`}
      onClickReplacement={onClickReplacement}
      size={size}
    />
  )
}
