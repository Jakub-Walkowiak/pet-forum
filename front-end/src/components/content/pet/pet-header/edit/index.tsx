'use client'

import SelectablePetTypeForm from '@/components/forms/selectable-forms/pet-type-form'
import SelectableUserForm from '@/components/forms/selectable-forms/user-form'
import Button from '@/components/forms/utils/button'
import EditableWrapper from '@/components/forms/utils/editable-wrapper'
import ImageUploaderWrapper from '@/components/forms/utils/image-uploader-wrapper'
import UploaderImages from '@/components/forms/utils/image-uploader-wrapper/uploader-images'
import PetSexSelect from '@/components/forms/utils/pet-sex-select'
import AccountProfilePicture from '@/components/images/profile-picture/account'
import PetProfilePicture from '@/components/images/profile-picture/pet'
import PetLabel from '@/components/labels/pet-label'
import PetSexLabel from '@/components/labels/pet-sex-label'
import PetTypeLabel from '@/components/labels/pet-type-label'
import TagLikeLabel from '@/components/labels/tag-like-label'
import TimeLabel from '@/components/labels/time-label'
import ValueAndText from '@/components/labels/value-and-text'
import patchPet, { PatchPetInputs, PatchPetInputsValidator } from '@/helpers/fetch-helpers/pet/patch-pet'
import showFloatingElement from '@/helpers/show-floating-element'
import showNotificationPopup from '@/helpers/show-notification-popup'
import stopEvent from '@/helpers/stop-event'
import usePet from '@/hooks/use-pet'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'

interface PetHeaderEditProps {
    id: number,
}

export default function PetHeaderEdit({ id, }: PetHeaderEditProps) {
    const data = usePet(id)
    const router = useRouter()

    const [update, setUpdate] = useState(false)
    const fileInputId = useId()
    const [loading, setLoading] = useState(false)

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<PatchPetInputs>({
        resolver: zodResolver(PatchPetInputsValidator),
    })

    const watchName = watch('name')
    const watchSex = watch('sex')
    const watchType = watch('type')
    const watchOwners = watch('owners')

    const handleFileChange = async (images: UploaderImages, e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.files === null || e.currentTarget.files.length === 0) return
        await images.add(e.currentTarget.files[0])
        setUpdate(true)
    }

    const clickFileButton = () => {
        const fileButton = document.getElementById(fileInputId) as HTMLButtonElement
        if (fileButton) fileButton.click()
    }

    useEffect(() => setUpdate(false), [update])

    const onSubmit = async (images: UploaderImages, data: PatchPetInputs) => {
        setLoading(true)

        try { 
            const response = await patchPet(id, images, data)
            
            if (response === false) showNotificationPopup(false, 'Failed to upload image')
            else {
                const main = await response.response
                if (main.status === 404) showNotificationPopup(false, 'Couldn\'t set pet\'s profile picture')
                else if (main.status === 403) showNotificationPopup(false, 'You do not own this pet')
                else if (main.ok) {
                    showNotificationPopup(true, response.ownersSuccess ? 'Changes saved' : 'Changes saved (failed to set owners)')
                    document.dispatchEvent(new CustomEvent('refreshpet'))
                    router.push(`/pets/${id}`)
                } else showNotificationPopup(false, 'Encountered server error')
            }
        } catch (err) { showNotificationPopup(false, 'Error contacting server') } 
        finally { setLoading(false) }
    }

    const handleSpeciesEdit = (e: React.MouseEvent) => {
        stopEvent(e)
        showFloatingElement(<SelectablePetTypeForm chosen={watchType} set={(choice) => setValue('type', choice)}/>, e.clientX, e.clientY)
    }

    const handleSexEdit = (e: React.MouseEvent) => {
        stopEvent(e)
        showFloatingElement(
            <div className='shadow-md shadow-black/70 text-lg rounded-lg'>
                <PetSexSelect register={register} name='sex' def={watchSex}/>
            </div>, 
            e.clientX, 
            e.clientY 
        )
    }

    const handleOwnerAdd = (e: React.MouseEvent) => {
        stopEvent(e)
        showFloatingElement(
            <SelectableUserForm 
                selectable={{
                    selected: watchOwners ? watchOwners : [],
                    set: (values) => setValue('owners', values) 
                }}
                excluded={data?.owners}
            />,
            e.clientX,
            e.clientY
        )
    }

    if (data === undefined) return (
        <div className='flex items-center justify-center text-2xl font-semibold'>Encountered error fetching pet profile</div>
    )
    else return (
        <ImageUploaderWrapper maxCount={1} maxResX={400} maxResY={400} overrideOnMax forceSquare render={(images) => (
            <form className='w-full' onSubmit={handleSubmit(async (data) => await onSubmit(images, data))}>
                <div className='w-full aspect-[13/3] bg-emerald-800'/>
                <div className='w-full relative flex p-2 gap-2'>
                    <div className='bg-emerald-500 rounded-full p-1 w-fit relative -top-12 flex-shrink-0'>
                        <input id={fileInputId} type='file' accept='image/png, image/jpeg, image/webp' className='hidden' onChange={e => handleFileChange(images, e)}/>
                        <div className='hover:opacity-75 cursor-pointer duration-200'>{images.urls.length === 0 
                            ? <PetProfilePicture id={id} sizeOverride={10} onClickReplacement={clickFileButton}/>
                            : <Image className='w-40 rounded-full' width={400} height={400} alt='Profile picture' src={images.urls[0]} onClick={clickFileButton}/>
                        }</div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex'>
                            <EditableWrapper
                                innerRenderer={(text) => <PetLabel id={id} text={text} size='extra_large'/>}
                                form={{ register, name: 'name', watcher: watchName, error: errors.name }}
                                inputPlaceholder='New name'
                                baseText={data.name}
                            />
                            <div className='w-min self-center ms-2 flex gap-2'>
                                {watchType
                                    ? typeof watchType === 'number' 
                                        ? <PetTypeLabel typeId={watchType} size='large' onClickReplacement={handleSpeciesEdit}/>
                                        : <TagLikeLabel text={watchType} size='large' onClickReplacement={handleSpeciesEdit}/>
                                    : <PetTypeLabel typeId={data.typeId} size='large' onClickReplacement={handleSpeciesEdit}/>}
                                <PetSexLabel sex={watchSex ? watchSex : data.sex} size='large' onClickReplacement={handleSexEdit}/>
                            </div>
                        </div>
                        <span className='text-lg text-zinc-500'>{data.owners.length > 1 ? 'Owners:' : 'Owner:'}</span>
                        <ul className='flex gap-1'>
                            {data.owners.map(id => (
                                <li key={id}><AccountProfilePicture id={id} sizeOverride={2.5}/></li>
                            ))}
                            <li>
                                <div onClick={handleOwnerAdd} className='relative w-10 h-10 rounded-full border-2 border-emerald-900 after:absolute after:inset-0 after:m-auto after:h-6 after:w-0.75 after:bg-emerald-500 before:absolute before:inset-0 before:m-auto before:h-0.75 before:w-6 before:bg-emerald-500 hover:bg-emerald-700/20 duration-200 hover:after:scale-110 hover:before:scale-110 cursor-pointer'/>
                            </li>
                        </ul>
                    </div>
                    <div className='absolute top-36 left-3'><Button text='Save' className='w-40 h-10'/></div>
                </div>

                <div className='flex px-3 py-4 items-end gap-3'>
                    <ValueAndText className='text-lg' value={data.followerCount} text='Followers'/>
                    <ValueAndText className='text-lg' value={data.featureCount} text='Posts featured in'/>

                    <div className='flex-1 flex justify-end h-fit'>
                        <TimeLabel mode='date' date={new Date(data.dateCreated)} prefix='Joined'/>
                    </div>
                </div>
            </form>
        )}/>
    )
}