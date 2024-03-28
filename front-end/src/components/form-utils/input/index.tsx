import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import PasswordInput from './password-input';
import PlainTextInput from './plain-text-input';

interface InputProps<T extends FieldValues> {
    placeholder: string,
    error?: boolean,
    password?: boolean,
    register?: UseFormRegister<T>,
    name?: Path<T>,
    className?: string,
    handleKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}

export default function Input<T extends FieldValues>({ placeholder, error = false, password = false, register, name, className, handleKeyUp }: InputProps<T>) {
    return !password
        ? <PlainTextInput handleKeyUp={handleKeyUp} placeholder={placeholder} error={error} register={register} name={name} className={className}/>
        : <PasswordInput handleKeyUp={handleKeyUp} placeholder={placeholder} error={error} register={register} name={name} className={className}/>
}