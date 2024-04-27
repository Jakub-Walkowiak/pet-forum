'use client'

import { getBlogTags } from "@/helpers/infinite-scroll-generators/get-blog-tags"
import showNotificationPopup from "@/helpers/show-notification-popup"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { z } from "zod"
import SelectableForm from ".."
import SelectableBlogTag from "../selectables/blog-tag"

export interface SelectableBlogTagFormProps {
    selectable: { 
        selected: Array<number>, 
        set: Dispatch<SetStateAction<Array<number>>>, 
    },
    added: { 
        values: Array<string>, 
        set: Dispatch<SetStateAction<Array<string>>>, 
    },
}

export default function SelectableBlogTagForm({ selectable, added }: SelectableBlogTagFormProps) {
    const [loading, setLoading] = useState(false)
    const [generator, setGenerator] = useState(getBlogTags())
    const [found, setFound] = useState(new Array<number>)

    const [tmpSelected, setTmpSelected] = useState(selectable.selected)
    const [tmpAdded, setTmpAdded] = useState(added.values)

    useEffect(() => {
        selectable.set(tmpSelected)
        added.set(tmpAdded)
    }, [selectable, added, tmpSelected, tmpAdded])

    const fetchTags = useCallback(async () => {
        setLoading(true)
        const fetched = (await generator.next()).value
        if (fetched !== undefined) setFound(old => [...old, ...fetched])
        setLoading(false)
    }, [generator])

    useEffect(() => { 
        setFound([])
        const refetch = async () => await fetchTags()
        refetch()
    }, [fetchTags])

    const display = (id: number, handleSelect: (id: number) => void, handleDeselect: (id: number) => void, checked: boolean) => {
        return <SelectableBlogTag tagId={id} checkHandler={handleSelect} uncheckHandler={handleDeselect} createChecked={checked}/>
    }

    const validator = z.string().trim()
        .min(1, { message: 'Min. tag length is 1' })
        .max(50, { message: 'Max. tag length is 50' })

    const handleAdd = async (name: string) => { 
        try {
            const response = await fetch(`http://localhost:3000/blog-posts/tags?limit=1&nameQuery=${name}&exactMatch=true`)
            if (!response.ok) showNotificationPopup(false, 'Error verifying availability')
            else {
                const json = (await response.json()) as { id: number }[]
                if (json.length === 0) setTmpAdded(old => old.includes(name) ? old : [...old, name])
                else setTmpSelected(old => old.includes(json[0].id) ? old : [...old, json[0].id])
            }  
        } catch (err) { showNotificationPopup(false, 'Error contacting server') }
    }

    return <SelectableForm
        onScroll={fetchTags}
        loading={loading}
        selectable={{
            values: found,
            selected: tmpSelected,
            set: setTmpSelected,
            displayer: display,
            onQuery: (query) => setGenerator(getBlogTags(query)),
        }}
        added={{
            values: tmpAdded,
            set: setTmpAdded,
            validator: validator,
            onSubmit: handleAdd,
        }}
    />
}