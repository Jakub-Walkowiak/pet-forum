'use client'

import { useId, useState } from 'react'

interface LabeledCheckboxProps<T> {
  text?: string
  createChecked?: boolean
  value?: T
  checkHandler?: (value: T) => void
  uncheckHandler?: (value: T) => void
  postfix?: string
}

export default function LabeledCheckbox<T>({
  text,
  createChecked = false,
  value,
  checkHandler,
  uncheckHandler,
  postfix,
}: LabeledCheckboxProps<T>) {
  const id = useId()
  const [checked, setChecked] = useState(createChecked)

  const onClick = () => {
    setChecked((old) => !old)
    if (checked === false && value !== undefined && checkHandler !== undefined) checkHandler(value)
    else if (checked === true && value !== undefined && uncheckHandler !== undefined) uncheckHandler(value)
  }

  return (
    <div className='animate-fade-in flex gap-1.5 items-center p-1.5'>
      <input
        type='checkbox'
        defaultChecked={checked}
        value={String(value)}
        className={`duration-200 w-5 h-5 appearance-none scale-100 rounded-md bg-gray-700 checked:bg-white cursor-pointer border border-gray-600 checked:border-none before:absolute before:block before:bg-gray-400 before:inset-0 before:m-auto before:h-0.5 before:w-3 after:absolute after:block after:bg-gray-400 after:inset-0 after:m-auto after:w-0.5 after:h-3 hover:before:bg-white hover:after:bg-white after:duration-200 before:duration-200 checked:after:rotate-90 checked:before:bg-gray-700 checked:after:bg-gray-700 checked:hover:before:bg-gray-800 checked:hover:after:bg-gray-800 hover:before:scale-y-150 hover:before:scale-x-125 hover:after:scale-x-150 hover:after:scale-y-125`}
        id={id}
        onClick={onClick}
      />
      <label htmlFor={id} className={`duration-200 text-md cursor-pointer ${checked && 'font-medium'}`}>
        {text}
      </label>
      <p className='flex-1 text-end text-sm text-gray-500'>{postfix}</p>
    </div>
  )
}
