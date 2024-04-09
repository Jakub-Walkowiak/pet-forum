import { useState } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface PasswordInputProps<T extends FieldValues> {
    placeholder: string,
    error: boolean,
    register?: UseFormRegister<T>,
    name?: Path<T>,
    className?: string,
    handleKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    defaultValue?: string,
}

export default function PasswordInput<T extends FieldValues>({ placeholder, error, register, name, className, handleKeyUp, defaultValue }: PasswordInputProps<T>) {
    const [show, setShow] = useState(false)

    const styles = error
        ? 'w-full bg-gray-800 rounded-lg p-2 font-medium duration-200 hover:bg-black/20 focus:bg-black/20 focus:scale-[1.02] border border-zinc-700 outline outline-2 outline-offset-2 outline-red-800 bg-red-200/20 text-red-800 focus:text-white'
        : 'w-full bg-gray-800 rounded-lg p-2 font-medium duration-200 hover:bg-black/20 focus:bg-black/20 focus:scale-[1.02] !outline-none border border-zinc-700'

    const showIcon = !show
        ? <AiOutlineEye className='absolute right-4 inset-y-0 m-auto text-2xl text-gray-500 hover:cursor-pointer hover:text-white duration-200' onClick={() => setShow(true)}/>
        : <AiOutlineEyeInvisible className='absolute right-4 inset-y-0 m-auto text-2xl text-gray-500 hover:cursor-pointer hover:text-white' onClick={() => setShow(false)}/>

    return register !== undefined && name !== undefined
        ? <div className='relative'><input defaultValue={defaultValue} placeholder={placeholder} className={`${className} ${styles}`} onKeyUp={handleKeyUp} {...register(name)} type={show ? 'text' : 'password'}/>{showIcon}</div>
        : <div className='relative'><input defaultValue={defaultValue} placeholder={placeholder} className={`${className} ${styles}`} onKeyUp={handleKeyUp} type={show ? 'text' : 'password'}/>{showIcon}</div>
}