import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface PlainTextInputProps<T extends FieldValues> {
    placeholder: string,
    error: boolean,
    register?: UseFormRegister<T>,
    name?: Path<T>,
    className?: string,
    handleKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}

export default function PlainTextInput<T extends FieldValues>({ placeholder, error, register, name, className, handleKeyUp }: PlainTextInputProps<T>) {
    const styles = error
        ? 'bg-gray-800 rounded-lg p-2 font-medium duration-200 hover:bg-black/20 focus:bg-black/20 focus:scale-[1.02] border border-zinc-700 outline outline-2 outline-offset-2 outline-red-800 bg-red-200/20 text-red-800 focus:text-white'
        : 'bg-gray-800 rounded-lg p-2 font-medium duration-200 hover:bg-black/20 focus:bg-black/20 focus:scale-[1.02] !outline-none border border-zinc-700'

    return register !== undefined && name !== undefined
        ? <input placeholder={placeholder} className={`${className} ${styles}`} onKeyUp={handleKeyUp} {...register(name)}/>
        : <input placeholder={placeholder} className={`${className} ${styles}`} onKeyUp={handleKeyUp}/>
}