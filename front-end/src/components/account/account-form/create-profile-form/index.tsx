'use client'

import Button from '@/components/forms/utils/button'
import ErrorContainer from '@/components/forms/utils/error-container'
import ImageUploaderWrapper from '@/components/forms/utils/image-uploader-wrapper'
import UploaderImages from '@/components/forms/utils/image-uploader-wrapper/uploader-images'
import Input from '@/components/forms/utils/input'
import showNotificationPopup from '@/helpers/show-notification-popup'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineClose } from 'react-icons/ai'
import { z } from 'zod'

interface CreateProfileFormProps {
    hide: VoidFunction,
}

const ProfileInputsValidator = z
    .object({
        displayName: z.string().trim().max(50, { message: 'Max. name length is 50 chars' }).optional(),
        bio: z.string().trim().max(300, { message: 'Max bio length is 300 chars' }).optional(),
    })

type ProfileInputs = z.infer<typeof ProfileInputsValidator>
    

export default function CreateProfileForm({ hide }: CreateProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(false)
    const fileInputId = useId()

    useEffect(() => setUpdate(false), [update])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileInputs>({
        resolver: zodResolver(ProfileInputsValidator)
    })

    const error = () => errors.displayName !== undefined

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

    const onSubmit = async (images: UploaderImages, data: ProfileInputs) => {
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

            const pfpId: number | undefined = imagesResponse !== undefined
                ? (await imagesResponse.json())[0].id
                : undefined
            const reqBody = { displayName: data.displayName, profilePictureId: pfpId, bio: data.bio }

            const response = await fetch('http://localhost:3000/accounts', {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
                credentials: 'include',
            })

            if (response.status === 404) showNotificationPopup(false, 'Couldn\'t set your profile picture')
            else if (response.ok) {
                showNotificationPopup(true, 'Changes saved')
                document.dispatchEvent(new CustomEvent('refreshprofile'))
                hide()
            } else showNotificationPopup(false, 'Encountered server error')
        } catch (err) { showNotificationPopup(false, 'Error contacting server')
        } finally { setLoading(false) }
    }

    return (
        <div className='fixed inset-x-0 inset-y-0 m-auto w-full max-w-xl z-50 h-fit overflow-y-auto max-h-full'>
            <ImageUploaderWrapper forceSquare maxCount={1} maxResX={400} maxResY={400} overrideOnMax render={(images) => (
                <form onSubmit={handleSubmit(async (data) => await onSubmit(images, data))} className='flex flex-col h-fit gap-4 px-8 py-5 bg-gray-900 rounded-lg items-stretch'>
                    <AiOutlineClose className='text-xl self-end hover:cursor-pointer' onClick={hide}/>

                    <p className='text-center text-3xl font-semibold leading-none'>
                        Set up your profile!<br/>
                        <span className='text-sm font-medium text-center text-gray-600'>(You can always do this later)</span>
                    </p>
        
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
                    
                    <div className='h-5'/>

                    <Input placeholder='Display name (same as account name by default)' register={register} name='displayName' error={errors.displayName !== undefined}/>
                    <Input placeholder='Bio - share a short summary of you' register={register} name='bio' error={errors.bio !== undefined}/>
                    <div className='h-10'/>

                    <ErrorContainer>
                        {errors.displayName && <p>{errors.displayName.message}</p>}
                        {errors.bio && <p>{errors.bio.message}</p>}
                    </ErrorContainer>
                    
                    <Button text='Save changes' disabled={error()} loading={loading}/>
                </form>
            )}/>  
        </div>
    )
}