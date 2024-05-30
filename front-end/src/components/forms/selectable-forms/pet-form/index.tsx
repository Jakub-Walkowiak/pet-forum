'use client'

import getPets from '@/helpers/infinite-scroll-generators/get-pets'
import useAuth from '@/hooks/use-auth'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import SelectableForm from '..'
import SelectablePet from './selectable-pet'

export interface SelectablePetFormProps {
  selectable: {
    selected: Array<number>
    set: Dispatch<SetStateAction<Array<number>>>
  }
}

export default function SelectablePetForm({ selectable }: SelectablePetFormProps) {
  const auth = useAuth()

  const [loading, setLoading] = useState(false)
  const [generator, setGenerator] = useState(getPets({ owner: auth }))
  const [found, setFound] = useState(new Array<number>())

  const [tmpSelected, setTmpSelected] = useState(selectable.selected)

  useEffect(() => selectable.set(tmpSelected), [selectable, tmpSelected])

  const fetchPets = useCallback(async () => {
    setLoading(true)
    const fetched = (await generator.next()).value
    if (fetched !== undefined) setFound((old) => [...old, ...fetched])
    setLoading(false)
  }, [generator])

  useEffect(() => {
    setFound([])
    const refetch = async () => await fetchPets()
    refetch()
  }, [fetchPets])

  const display = (
    id: number,
    handleSelect: (id: number) => void,
    handleDeselect: (id: number) => void,
    checked: boolean,
  ) => {
    return (
      <SelectablePet petId={id} checkHandler={handleSelect} uncheckHandler={handleDeselect} createChecked={checked} />
    )
  }

  return !auth ? (
    <div className='flex w-60 h-40 border border-gray-600 rounded-lg bg-gray-800 justify-center align-center'>
      Encountered error during authentication
    </div>
  ) : (
    <SelectableForm
      onScroll={fetchPets}
      loading={loading}
      selectable={{
        values: found,
        selected: tmpSelected,
        set: setTmpSelected,
        displayer: display,
        onQuery: (query) => setGenerator(getPets({ nameQuery: query, owner: auth })),
      }}
      placeholder='Look for pets...'
    />
  )
}
