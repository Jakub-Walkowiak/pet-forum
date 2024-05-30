import showFloatingElement from '@/helpers/show-floating-element'
import { MouseEvent, ReactNode } from 'react'
import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import Input from '../input'

interface EditableWrapper<T extends FieldValues> {
  innerRenderer: (text: string) => ReactNode
  baseText?: string
  form?: {
    register: UseFormRegister<T>
    name: Path<T>
    watcher?: string
    error?: FieldError
  }
  className?: string
  inputPlaceholder?: string
}

export default function EditableWrapper<T extends FieldValues>({
  innerRenderer,
  baseText,
  form,
  className,
  inputPlaceholder,
}: EditableWrapper<T>) {
  const showInput = (e: MouseEvent) => {
    if (form)
      showFloatingElement(
        <Input
          focused
          register={form.register}
          name={form.name}
          placeholder={inputPlaceholder ? inputPlaceholder : ''}
          className='w-60 bg-gray-800 hover:bg-gray-800 focus:bg-gray-800 shadow-md shadow-black/70'
        />,
        e.clientX,
        e.clientY,
      )
  }

  return (
    <div
      className={`${className} w-fit border-b ${form?.error ? 'bg-red-400/20 border-red-500 hover:bg-red-400/40' : 'bg-emerald-400/20 border-emerald-500 hover:bg-emerald-400/40'} *:pointer-events-none cursor-pointer duration-200`}
      onClick={showInput}
    >
      {innerRenderer(form?.watcher ? form.watcher : baseText ? baseText : '')}
    </div>
  )
}
