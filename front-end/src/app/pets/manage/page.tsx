'use client'

import PetFeed from "@/components/content/dynamic-feeds/pet-feed"
import CreatePetForm from "@/components/forms/create-pet-form"
import Button from "@/components/forms/utils/button"
import { PetOrderByOption } from "@/helpers/fetch-options/pet-fetch-options"
import showModal from "@/helpers/show-modal"
import useAuth from "@/hooks/use-auth"

export default function Page() {
    const auth = useAuth()

    if (auth) return (
        <>
            <div className='w-full h-14 flex items-center justify-between border-b border-zinc-700 py-10 px-10'>
                <p className='text-3xl font-semibold'>Your pets</p>
                <div className='flex text-xl'><Button text='Add pet' onClickHandler={() => showModal(<CreatePetForm/>)}/></div>
            </div>
            <PetFeed options={{ owner: auth, orderBy: PetOrderByOption.NAME }}/>
        </>
    )
    else return (
        <div className='w-full h-full flex items-center justify-center text-4xl font-bold'>Log in to add pets!</div>
    )
}