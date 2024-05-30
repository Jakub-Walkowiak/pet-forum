import { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import PasswordInput from './password-input'
import PlainTextInput from './plain-text-input'

interface InputProps<T extends FieldValues> {
  placeholder: string
  error?: boolean
  password?: boolean
  register?: UseFormRegister<T>
  name?: Path<T>
  className?: string
  handleKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  defaultValue?: string
  focused?: boolean
}

export default function Input<T extends FieldValues>({
  defaultValue,
  placeholder,
  error = false,
  password = false,
  register,
  name,
  className,
  handleKeyUp,
  focused = false,
}: InputProps<T>) {
  return !password ? (
    <PlainTextInput
      focused={focused}
      handleKeyUp={handleKeyUp}
      placeholder={placeholder}
      error={error}
      register={register}
      name={name}
      className={className}
      defaultValue={defaultValue}
    />
  ) : (
    <PasswordInput
      focused={focused}
      handleKeyUp={handleKeyUp}
      placeholder={placeholder}
      error={error}
      register={register}
      name={name}
      className={className}
      defaultValue={defaultValue}
    />
  )
}
