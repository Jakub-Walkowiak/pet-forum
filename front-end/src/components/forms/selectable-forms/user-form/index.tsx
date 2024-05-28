'use client'

import getAccounts from "@/helpers/infinite-scroll-generators/get-accounts"
import { useCallback, useEffect, useState } from "react"
import SelectableForm from ".."
import SelectableUser from "./selectable-user"

export interface SelectableUserFormProps {
    selectable: { 
        selected: Array<number>, 
        set: (values: Array<number>) => void, 
    },
    excluded?: Array<number>,
}

export default function SelectableUserForm({ selectable, excluded = [] }: SelectableUserFormProps) {
    const [loading, setLoading] = useState(false)
    const [generator, setGenerator] = useState(getAccounts())
    const [found, setFound] = useState(new Array<number>)

    const [tmpSelected, setTmpSelected] = useState(selectable.selected)

    useEffect(() => selectable.set(tmpSelected), [selectable, tmpSelected])

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        const fetched = (await generator.next()).value
        if (fetched !== undefined) setFound(old => [...old, ...fetched.filter(id => !excluded.includes(id))])
        setLoading(false)
    }, [generator, excluded])

    useEffect(() => { 
        setFound([])
        const refetch = async () => await fetchUsers()
        refetch()
    }, [fetchUsers])

    const display = (id: number, handleSelect: (id: number) => void, handleDeselect: (id: number) => void, checked: boolean) => {
        return <SelectableUser userId={id} checkHandler={handleSelect} uncheckHandler={handleDeselect} createChecked={checked}/>
    }

    return <SelectableForm
        onScroll={fetchUsers}
        loading={loading}
        selectable={{
            values: found,
            selected: tmpSelected,
            set: setTmpSelected,
            displayer: display,
            onQuery: (contains) => setGenerator(getAccounts({ contains })),
        }}
        placeholder="Look for users..."
    />
}