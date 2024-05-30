'use client'

import usePetType from '@/hooks/use-pet-type'
import LabeledCheckbox from '../../../utils/labeled-checkbox'

interface SelectableBlogTagProps {
  typeId: number
  checkHandler?: (value: number) => void
  uncheckHandler?: (value: number) => void
  createChecked?: boolean
}

export default function SelectablePetType({
  typeId,
  checkHandler,
  uncheckHandler,
  createChecked = false,
}: SelectableBlogTagProps) {
  const petInfo = usePetType(typeId)

  if (petInfo !== undefined)
    return (
      <LabeledCheckbox
        createChecked={createChecked}
        text={petInfo.typeName}
        value={typeId}
        postfix={`${petInfo.timesUsed}`}
        checkHandler={checkHandler}
        uncheckHandler={uncheckHandler}
      />
    )
}
