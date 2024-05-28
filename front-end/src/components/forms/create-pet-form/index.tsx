'use client'

import Button from '@/components/forms/utils/button'
import ErrorContainer from '@/components/forms/utils/error-container'
import ImageUploaderWrapper from '@/components/forms/utils/image-uploader-wrapper'
import UploaderImages from '@/components/forms/utils/image-uploader-wrapper/uploader-images'
import Input from '@/components/forms/utils/input'
import CloseModalButton from '@/components/utils/close-modal-button'
import dismissModal from '@/helpers/dismiss-modal'
import { PetSex } from '@/helpers/fetch-options/pet-fetch-options'
import showFloatingElement from '@/helpers/show-floating-element'
import showNotificationPopup from '@/helpers/show-notification-popup'
import stopEvent from '@/helpers/stop-event'
import useAuth from '@/hooks/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import SelectablePetTypeForm from '../selectable-forms/pet-type-form'
import PetSexSelect from '../utils/pet-sex-select'

const PetInputsValidator = z
    .object({
        name: z.string().trim()
            .min(1, { message: 'Name required' })
            .max(50, { message: 'Max. name length is 50 chars' }),
        type: z.union([z.string(), z.number()]),
        sex: z.nativeEnum(PetSex).default(PetSex.NOT_APPLICABLE),
    })

type PetInputs = z.infer<typeof PetInputsValidator>
    

export default function CreatePetForm() {
    const auth = useAuth()

    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(false)
    const fileInputId = useId()

    useEffect(() => setUpdate(false), [update])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        getValues,
        setValue,
    } = useForm<PetInputs>({
        resolver: zodResolver(PetInputsValidator)
    })

    const error = () => errors.name !== undefined

    const handleFileChange = async (images: UploaderImages, e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.files === null || e.currentTarget.files.length === 0) return
        await images.add(e.currentTarget.files[0])
        setUpdate(true)
    }

    const handleFileButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        document.getElementById(fileInputId)?.click()
    }

    const handleRemoveButtonClick = (images: UploaderImages, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        images.remove(0)
        setUpdate(true)
    }

    const handleSpeciesButtonClick = (e: React.MouseEvent) => {
        e.preventDefault()
        stopEvent(e)
        showFloatingElement(<SelectablePetTypeForm chosen={getValues().type} set={(choice) => setValue('type', choice)}/>, e.clientX, e.clientY)
    }

    const onSubmit = async (images: UploaderImages, data: PetInputs) => {
        setLoading(true)

        try {
            const imagesResponse = await images.upload()

            if (images.urls.length !== 0) {
                if (imagesResponse === undefined) throw error
                else if (!imagesResponse.ok) {
                    showNotificationPopup(false, 'Failed to upload image')
                    return
                }
            }

            if (typeof data.type === 'string') {
                const response = await fetch('http://localhost:3000/pets/types', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: data.type }),
                    credentials: 'include',
                })
                data.type = (await response.json()).id as number
            }

            const pfpId: number | undefined = imagesResponse !== undefined
                ? (await imagesResponse.json())[0].id
                : undefined
            const reqBody = { name: data.name, profilePictureId: pfpId, type: data.type, sex: data.sex, owners: [auth] }

            const response = await fetch('http://localhost:3000/pets', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
                credentials: 'include',
            })

            if (response.status === 404) showNotificationPopup(false, 'Couldn\'t set pet\'s profile picture')
            else if (response.status === 409) setError('name', { message: 'Name already in use' })
            else if (response.ok) {
                showNotificationPopup(true, 'Pet profile created!')
                document.dispatchEvent(new CustomEvent('refreshpet'))
                dismissModal()
            } else showNotificationPopup(false, 'Encountered server error')
        } catch (err) { showNotificationPopup(false, 'Error contacting server')
        } finally { setLoading(false) }
    }

    return (
        <div className='fixed inset-x-0 inset-y-0 m-auto w-full max-w-xl z-50 h-fit overflow-y-auto max-h-full'>
            <ImageUploaderWrapper forceSquare maxCount={1} maxResX={400} maxResY={400} overrideOnMax render={(images) => (
                <form onSubmit={handleSubmit(async (data) => await onSubmit(images, data))} className='flex flex-col h-fit gap-4 px-8 py-5 bg-gray-900 rounded-lg items-stretch'>
                    <CloseModalButton/>

                    <Input placeholder={'Pet\'s name'} register={register} name='name' error={errors.name !== undefined}/>

                    <div className='flex gap-2'>Sex: 
                        <PetSexSelect register={register} name='sex' def={PetSex.NOT_APPLICABLE}/>
                    </div>

                    <div className='flex gap-2 items-center'>Species:
                        <Button text='Choose' dark className='w-full' onClickHandler={handleSpeciesButtonClick}/>
                    </div>
                    
                    <div className='h-5'/>

                    <span className='text-center font-semibold text-xl'>Profile picture</span>
                    <div className='px-24 flex flex-col items-stretch bg-gray-800/60 border border-zinc-700 rounded-lg p-4'>
                        <input id={fileInputId} type='file' accept='image/png, image/jpeg, image/webp' className='hidden' onChange={e => handleFileChange(images, e)}/>
                        <Button text='Choose file' onClickHandler={handleFileButtonClick}/>
                        <div className='w-64 h-64 self-center my-4'>
                            {images.urls[0] !== undefined
                                ? <Image src={images.urls[0]} width={400} height={400} alt={'Your profile picture'} className='rounded-full w-full h-full'/>
                                : <div className='w-full h-full rounded-full bg-emerald-600'/>}
                        </div>
                        <Button disabled={images.urls[0] === undefined} text='Remove' onClickHandler={e => handleRemoveButtonClick(images, e)}/>
                    </div>

                    <div className='h-10'/>        

                    <ErrorContainer>
                        {errors.name && <p>{errors.name.message}</p>}
                        {errors.type && <p>Species must be chosen</p>}
                    </ErrorContainer>
                    
                    <Button text='Save changes' disabled={error()} loading={loading}/>
                </form>
            )}/>  
        </div>
    )
}