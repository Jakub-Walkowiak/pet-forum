'use client'

import useProfile from '@/hooks/use-profile'
import LabeledCheckbox from '../../../utils/labeled-checkbox'

interface SelectableUserProps {
  userId: number
  checkHandler?: (value: number) => void
  uncheckHandler?: (value: number) => void
  createChecked?: boolean
}

export default function SelectableUser({
  userId,
  checkHandler,
  uncheckHandler,
  createChecked = false,
}: SelectableUserProps) {
  const info = useProfile(userId)

  if (info !== undefined)
    return (
      <LabeledCheckbox
        createChecked={createChecked}
        text={`@${info.accountName}`}
        value={userId}
        postfix={`${info.ownedPetCount}`}
        checkHandler={checkHandler}
        uncheckHandler={uncheckHandler}
      />
    )
}
