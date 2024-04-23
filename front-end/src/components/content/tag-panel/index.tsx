'use client'

import Input from '@/components/utils/form-utils/input'
import LabeledCheckbox from '@/components/utils/form-utils/labeled-checkbox'
import showNotificationPopup from '@/helpers/show-notification-popup'
import stopEvent from '@/helpers/stop-event'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading, AiOutlinePlusCircle, AiOutlineSearch } from 'react-icons/ai'
import { z } from 'zod'
import TagCheckbox from './tag-checkbox'

export interface TagPanelProps {
    selected: Array<number>,
    setSelected: Dispatch<SetStateAction<Array<number>>>,
    added: Array<string>,
    setAdded: Dispatch<SetStateAction<Array<string>>>,
    x: number,
    y: number,
}

const TagPanelValidator = z.object({
    name: z.string().trim()
        .min(1, { message: '' }).max(50, { message: 'Max. tag length is 50' })
})

type TagPanelValues = z.infer<typeof TagPanelValidator>

async function* searchTags(query?: string) {
    let offset = 0
    const getFetchUrl = (offset: number) => {
        return query === undefined
            ? `http://localhost:3000/blog-posts/tags?limit=10&offset=${offset}`
            : `http://localhost:3000/blog-posts/tags?limit=10&offset=${offset}&nameQuery=${query}`
    }

    while (true) {
        try {
            const response = await fetch(getFetchUrl(offset))
            if (!response.ok) showNotificationPopup(false, 'Error fetching tags')
            else {
                const result = ((await response.json()) as {id: number}[])
                    .map(row => row.id)

                if (result.length !== 0) { 
                    yield result
                    offset += 10
                } else yield
            }
        } catch (err) { 
            showNotificationPopup(false, 'Error contacting server') 
        } 
    }
}

export default function TagPanel({ selected, added, setSelected, setAdded, x, y }: TagPanelProps) {
    const [found, setFound] = useState(new Array<number>())
    const [loading, setLoading] = useState(false)
    const [tagGenerator, setTagGenerator] = useState(searchTags())
    const [tempSelected, setTempSelected] = useState(selected)
    const [tempAdded, setTempAdded] = useState(added)

    const updateTags = useCallback(async () => {
        setLoading(true)
        const newFound = (await tagGenerator.next()).value
        if (newFound instanceof Array) setFound(old => [...old, ...newFound])
        setLoading(false)
    }, [tagGenerator])
    
    useEffect(() => { 
        setFound([])
        updateTags() 
    }, [tagGenerator, updateTags])

    useEffect(() => () => { 
        setSelected(tempSelected)
        setAdded(tempAdded)
    }, [tempSelected, tempAdded])

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<TagPanelValues>({
        resolver: zodResolver(TagPanelValidator),
    })

    const handleSelect = (value: number) => setTempSelected(old => [...old, value])
    const handleDeselect = (value: number) => setTempSelected(old => old.filter(item => item !== value))

    const handleAdd = async (name: string) => { 
        try {
            const response = await fetch(`http://localhost:3000/blog-posts/tags?limit=1&nameQuery=${name}&exactMatch=true`)
            if (!response.ok) showNotificationPopup(false, 'Error verifying availability')
            else {
                const json = (await response.json()) as { id: number }[]
                if (json.length === 0) setTempAdded(old => [...old, name])
                else setTempSelected(old => [...old, json[0].id])
            }  
        } catch (err) { showNotificationPopup(false, 'Error contacting server') }
    }

    const handleDeselectAdded = (name: string) => setTimeout(() => setTempAdded(old => old.filter(item => item !== name)), 350)

    const handleSearch = () => setTagGenerator(searchTags(getValues('name')))

    const handleScroll = (e: React.MouseEvent<HTMLUListElement>) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight) < 1) updateTags()
    }

    return (
        <form style={{ top: y, left: x }} className={`fixed flex flex-col w-60 border border-gray-600 rounded-lg bg-gray-800`} onClick={stopEvent} onScroll={stopEvent}>
            <ul className='list-none flex flex-col h-40 w-full bg-black/10 overflow-y-auto' onScroll={handleScroll}>
                {tempAdded.map(name => (
                    <li key={`a-${name}`}><LabeledCheckbox createChecked text={name} value={name} postfix='new' uncheckHandler={handleDeselectAdded}/></li>
                ))}

                {tempSelected.map(id => (
                    <li key={`s-${id}`}><TagCheckbox createChecked tagId={id} checkHandler={handleSelect} uncheckHandler={handleDeselect}/></li>
                ))}

                {found.filter(id => !tempSelected.includes(id)).map(id => (
                    <li key={`f-${id}`}><TagCheckbox tagId={id} checkHandler={handleSelect} uncheckHandler={handleDeselect}/></li>
                ))}

                {loading 
                    ? <li className='w-full flex items-center justify-center mb-2 mt-1 text-xl'><AiOutlineLoading className='animate-spin'/></li>
                    : <li className='w-full flex items-center justify-center mb-2 mt-1 text-sm text-gray-500'>Nothing too see here...</li>}
            </ul>
            <div className='w-full h-10 border-t border-gray-600 p-1.5 bg-black/20 relative'>
                <Input className='w-full h-full' placeholder='Look for tags...' register={register} name={'name'} handleKeyUp={handleSearch}/>
                <AiOutlineSearch className='absolute inset-y-0 my-auto right-9 text-gray-400 text-lg cursor-pointer hover:text-white duration-200' onClick={handleSearch}/>
                <AiOutlinePlusCircle className='absolute inset-y-0 my-auto right-3 text-gray-400 text-lg cursor-pointer hover:text-white duration-200' 
                    onClick={handleSubmit(data => handleAdd(data.name), 
                        () => { if (errors.name?.message !== undefined && errors.name?.message !== '') showNotificationPopup(false, errors.name.message) })}/>
            </div>
        </form>
    )
}