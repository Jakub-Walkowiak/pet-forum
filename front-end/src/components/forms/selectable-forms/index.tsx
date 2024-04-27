'use client'

import showNotificationPopup from '@/helpers/show-notification-popup'
import stopEvent from '@/helpers/stop-event'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading, AiOutlinePlusCircle, AiOutlineSearch } from 'react-icons/ai'
import { z } from 'zod'
import Input from '../utils/input'
import LabeledCheckbox from '../utils/labeled-checkbox'

export interface SelectableFormProps<T> {
    selectable: { 
        selected: Array<T>, 
        set: Dispatch<SetStateAction<Array<T>>>, 
        values: Array<T>,
        displayer: (id: T, handleSelect: (id: T) => void, handleDeselect: (id: T) => void, checked: boolean) => ReactNode,
        onQuery: (query: string) => void,
    },
    added?: { 
        values: Array<string>, 
        set: Dispatch<SetStateAction<Array<string>>>, 
        validator: z.ZodString, 
        onSubmit: (name: string) => void,
    },
    loading?: boolean,
    onScroll?: () => void,
}

export default function SelectableForm<T>({ added, selectable, loading = false, onScroll }: SelectableFormProps<T>) {
    const [unAddTimeouts, setUnAddTimeouts] = useState(new Map<string, NodeJS.Timeout>())

    const SelectableFormValidator = z.object({
        name: added ? added.validator : z.string(),
    })

    type Values = z.infer<typeof SelectableFormValidator>

    const {
        register,
        handleSubmit,
        getValues,
    } = useForm<Values>({
        resolver: zodResolver(SelectableFormValidator),
    })

    const handleSelect = (value: T) => selectable.set(old => old.includes(value) ? old : [...old, value])
    const handleDeselect = (value: T) => selectable.set(old => old.filter(item => item !== value))

    const handleUnAdd = (name: string) => { 
        setUnAddTimeouts(old => old?.set(name, setTimeout(() => added?.set(old => old.filter(item => item !== name)), 350)))
    }

    const handleReAdd = (name: string) => {
        clearTimeout(unAddTimeouts?.get(name))
        setUnAddTimeouts(old => { old?.delete(name); return old })
    }

    const handleScroll = (e: React.MouseEvent<HTMLUListElement>) => { 
        if (onScroll && Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight) < 1) onScroll()
    }

    return (
        <form className='flex flex-col w-60 border border-gray-600 rounded-lg bg-gray-800' onClick={stopEvent} onScroll={stopEvent}>
            <ul className='list-none flex flex-col h-40 w-full bg-black/10 overflow-y-auto' onScroll={handleScroll}>
                {added?.values
                    .filter(name => !getValues('name') || name.toLowerCase().includes(getValues('name')))
                    .map(name => (
                        <li key={`${name}`}><LabeledCheckbox createChecked text={name} value={name} postfix='new' uncheckHandler={handleUnAdd} checkHandler={handleReAdd}/></li>
                    ))
                }

                {selectable.selected
                    .filter(id => selectable.values.includes(id))
                    .map(id => (
                        <li key={`${id}`}>{selectable.displayer(id, handleSelect, handleDeselect, true)}</li>
                    ))
                }

                {selectable.values.filter(id => !selectable.selected.includes(id)).map(id => (
                    <li key={`${id}`}>{selectable.displayer(id, handleSelect, handleDeselect, false)}</li>
                ))}

                {loading 
                    ? <li className='w-full flex items-center justify-center mb-2 mt-1 text-xl'><AiOutlineLoading className='animate-spin'/></li>
                    : <li className='w-full flex items-center justify-center mb-2 mt-1 text-sm text-gray-500'>Nothing too see here...</li>}
            </ul>
            <div className='w-full h-10 border-t border-gray-600 p-1.5 bg-black/20 relative'>
                <Input className='w-full h-full' placeholder='Look for tags...' register={register} name={'name'} handleKeyUp={() => selectable.onQuery(getValues('name'))}/>
                <AiOutlineSearch className='absolute inset-y-0 my-auto right-9 text-gray-400 text-lg cursor-pointer hover:text-white duration-200' onClick={() => selectable.onQuery(getValues('name'))}/>
                {added && <AiOutlinePlusCircle className='absolute inset-y-0 my-auto right-3 text-gray-400 text-lg cursor-pointer hover:text-white duration-200' 
                    onClick={handleSubmit(async data => added.onSubmit(data.name), 
                        err => { showNotificationPopup(false, err.name?.message === undefined ? 'Encountered error' : err.name.message) })}
                />}
            </div>
        </form>
    )
}