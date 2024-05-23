import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface SelectProps<T extends FieldValues> {
    def?: string,
    options: Map<string, string>,
    register?: UseFormRegister<T>,
    name?: Path<T>,
    multiple?: boolean
}

export default function Select<T extends FieldValues>({ options, register, name, def, multiple = false }: SelectProps<T>) {
    return (
        <select multiple={multiple} defaultValue={def} {...(register !== undefined && name !== undefined && register(name))} className='w-full bg-gray-700 px-1 py-0.5 rounded-lg text-gray-300 cursor-pointer !outline-none'>
            {Array.from(options).map((option, idx) => <option key={idx} value={option[0]}>{option[1]}</option>)}
        </select>
    )
}