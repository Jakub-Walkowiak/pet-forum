import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import PasswordInput from './password-input';
import PlainTextInput from './plain-text-input';

interface InputProps<T extends FieldValues> {
    placeholder: string,
    error?: boolean,
    password?: boolean,
    register?: UseFormRegister<T>,
    name?: Path<T>,
}

export default function Input<T extends FieldValues>({ placeholder, error = false, password = false, register, name}: InputProps<T>) {
    return !password
        ? <PlainTextInput placeholder={placeholder} error={error} register={register} name={name}/>
        : <PasswordInput placeholder={placeholder} error={error} register={register} name={name}/>
}