'use client'

import { getPetTypes } from '@/helpers/infinite-scroll-generators/get-pet-types'
import showNotificationPopup from '@/helpers/show-notification-popup'
import { useCallback, useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import SelectableForm from '..'
import SelectablePetType from './selectable-pet-type'

export interface SelectablePetTypeFormProps {
  chosen?: string | number
  set: (choice?: string | number) => void
}

export default function SelectablePetTypeForm({ chosen, set }: SelectablePetTypeFormProps) {
  const [loading, setLoading] = useState(false)
  const [generator, setGenerator] = useState(getPetTypes())
  const [found, setFound] = useState(new Array<number>())

  const [selected, setSelected] = useState(new Array<number>())
  const [added, setAdded] = useState(new Array<string>())

  const selectedCount = useRef(0)
  const addedCount = useRef(0)

  useEffect(() => {
    if (typeof chosen === 'string') setAdded([chosen])
    else if (typeof chosen === 'number') setSelected([chosen])
  }, [chosen])

  useEffect(() => {
    selectedCount.current = selected.length
  }, [selected])
  useEffect(() => {
    addedCount.current = added.length
  }, [added])

  useEffect(() => {
    if (selected.length !== 0) {
      if (selected.length > 1) setSelected((old) => [old[old.length - 1]])
      else {
        setAdded([])
        set(selected[0])
      }
    } else if (addedCount.current === 0) set()
  }, [selected, set])

  useEffect(() => {
    if (added.length !== 0) {
      if (added.length > 1) setAdded((old) => [old[old.length - 1]])
      else {
        setSelected([])
        set(added[0])
      }
    } else if (selectedCount.current === 0) set()
  }, [added, set])

  const fetchTypes = useCallback(async () => {
    setLoading(true)
    const fetched = (await generator.next()).value
    if (fetched !== undefined) setFound((old) => [...old, ...fetched])
    setLoading(false)
  }, [generator])

  useEffect(() => {
    setFound([])
    const refetch = async () => await fetchTypes()
    refetch()
  }, [fetchTypes])

  const display = (
    id: number,
    handleSelect: (id: number) => void,
    handleDeselect: (id: number) => void,
    checked: boolean,
  ) => {
    return (
      <SelectablePetType
        typeId={id}
        checkHandler={handleSelect}
        uncheckHandler={handleDeselect}
        createChecked={checked}
      />
    )
  }

  const validator = z
    .string()
    .trim()
    .min(1, { message: 'Min. tag length is 1' })
    .max(50, { message: 'Max. tag length is 50' })

  const handleAdd = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:3000/pets/types?limit=1&nameQuery=${name}&exactMatch=true`)
      if (!response.ok) showNotificationPopup(false, 'Error verifying availability')
      else {
        const json = (await response.json()) as Array<number>
        if (json.length === 0) setAdded([name])
        else setSelected([json[0]])
      }
    } catch (err) {
      showNotificationPopup(false, 'Error contacting server')
    }
  }

  return (
    <SelectableForm
      onScroll={fetchTypes}
      loading={loading}
      selectable={{
        values: found,
        selected: selected,
        set: setSelected,
        displayer: display,
        onQuery: (query) => setGenerator(getPetTypes(query)),
      }}
      added={{
        values: added,
        set: setAdded,
        validator: validator,
        onSubmit: handleAdd,
      }}
      placeholder='Look for types...'
    />
  )
}
