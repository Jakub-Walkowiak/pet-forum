'use client'

import Button from '@/components/forms/utils/button'
import EditableWrapper from '@/components/forms/utils/editable-wrapper'
import ImageUploaderWrapper from '@/components/forms/utils/image-uploader-wrapper'
import UploaderImages from '@/components/forms/utils/image-uploader-wrapper/uploader-images'
import TogglableWrapper from '@/components/forms/utils/togglable-wrapper'
import AccountProfilePicture from '@/components/images/profile-picture/account'
import AccountLabel from '@/components/labels/account-label'
import showNotificationPopup from '@/helpers/show-notification-popup'
import patchProfile, { PatchProfileInputs, PatchProfileInputsValidator } from '@/helpers/uploaders/patch-profile'
import useAuth from '@/hooks/use-auth'
import useProfile from '@/hooks/use-profile'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiFillInfoCircle, AiOutlineInfoCircle } from 'react-icons/ai'

interface UserHeaderProps {
    id: number,
    setLikesTab?: Dispatch<SetStateAction<boolean>>,
}

export default function UserHeaderEdit({ id, setLikesTab }: UserHeaderProps) {
    const data = useProfile(id)
    const auth = useAuth()
    const router = useRouter()

    const [update, setUpdate] = useState(false)
    const fileInputId = useId()

    const [showStats, setShowStats] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<PatchProfileInputs>({
        resolver: zodResolver(PatchProfileInputsValidator),
    })
    
    const watchDisplayName = watch('displayName')
    const watchBio = watch('bio')
    const watchFollowedVisible = watch('followedVisible')
    const watchLikesVisible = watch('likesVisible')

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

    useEffect(() => { 
        if (data !== undefined) if (setLikesTab) setLikesTab(data.likesVisible || (!data.likesVisible && auth === id))
    }, [data, auth, id, setLikesTab])

    const onSubmit = async (images: UploaderImages, data: PatchProfileInputs) => {
        setLoading(true)

        try { patchProfile(images, data, () => router.push(`/users/${id}`)) }
        catch (err) { showNotificationPopup(false, 'Error contacting server') } 
        finally { setLoading(false) }
    }

    const handleAccountNameClick = (e: React.BaseSyntheticEvent) => {
        e.stopPropagation()
        showNotificationPopup(false, 'Edit in account settings')
    }

    if (data === undefined) return (
        <div className='flex items-center justify-center text-2xl font-semibold'>Encountered error fetching profile</div>
    )
    else return (
        <ImageUploaderWrapper maxCount={1} maxResX={400} maxResY={400} overrideOnMax forceSquare render={(images) => (
            <form className='w-full' onSubmit={handleSubmit(async (data) => await onSubmit(images, data))}>
                <div className='w-full aspect-[13/3] bg-emerald-800'/>
                <div className='w-full relative flex p-2 gap-2'>
                    <div className='bg-emerald-500 rounded-full p-1 relative -top-12 flex-shrink-0 w-fit h-fit'>
                        <input id={fileInputId} type='file' accept='image/png, image/jpeg, image/webp' className='hidden' onChange={e => handleFileChange(images, e)}/>
                        <div className='hover:opacity-75 cursor-pointer duration-200'>{images.urls.length === 0 
                            ? <AccountProfilePicture id={id} sizeOverride={10} onClickReplacement={clickFileButton}/>
                            : <Image className='w-40 rounded-full' width={400} height={400} alt='Profile picture' src={images.urls[0]} onClick={clickFileButton}/>
                        }</div>
                    </div>
                    <div className='flex flex-col'>
                        <EditableWrapper 
                            innerRenderer={(text) => <AccountLabel id={id} text={text} size='extra_large' displayName/>} 
                            baseText={data.displayName}
                            form={{ register, name: 'displayName', watcher: watchDisplayName, error: errors.displayName }}
                            inputPlaceholder='New display name'
                        />
                        <div onClick={handleAccountNameClick} className='*:pointer-events-none'><AccountLabel id={id} text={data.accountName} size='extra_large'/></div>
                        <EditableWrapper
                            className='relative top-4'
                            innerRenderer={(text) => <div className='break-all text-gray-200'>{text}</div>}
                            baseText={data.bio}
                            form={{ register, name: 'bio', watcher: watchBio, error: errors.bio }}
                            inputPlaceholder='New bio'
                        />
                        
                    </div>
                    <div className='absolute top-36 left-3'><Button text='Save' className='w-40 h-10'/></div>
                </div>

                <div className='flex px-3 py-4 items-end'>
                    <span className='cursor-pointer group'>
                        <span className='font-bold pe-1 text-lg'>{data.followerCount}</span>
                        <span className='text-gray-500 text-lg pe-3 group-hover:underline'>Followers</span>
                    </span>

                    <TogglableWrapper 
                        innerRenderer={() => (<>
                            <span className={`font-bold pe-1 text-lg duration-200`}>{data.accountsFollowedCount}</span>
                            <span className={`text-gray-500 text-lg duration-200`}>Followed</span>
                        </>)}
                        className='me-3'
                        baseState={data.followedVisible}
                        form={{ watcher: watchFollowedVisible, set: (state) => setValue('followedVisible', state) }}
                        text={{ true: 'Shown', false: 'Hidden' }}
                    />

                    {showStats
                        ? <AiFillInfoCircle className='text-xl inset-y-0 my-auto cursor-pointer hover:text-gray-500 duration-200 me-3' onClick={() => setShowStats(false)}/>
                        : <AiOutlineInfoCircle className='text-xl text-gray-500 inset-y-0 my-auto cursor-pointer hover:text-white duration-200 me-3' onClick={() => setShowStats(true)}/>}

                    <TogglableWrapper 
                        innerRenderer={(visible) => <span className={`${visible ? 'font-semibold' : 'font-normal'} text-lg`}>Likes {visible ? 'shown' : 'hidden'}</span>}
                        className='me-3'
                        baseState={data.likesVisible}
                        form={{ watcher: watchLikesVisible, set: (state) => setValue('likesVisible', state) }}
                        text={{ true: 'Shown', false: 'Hidden' }}
                    />
                </div>

                <div className={`${!showStats ? 'h-0' : 'h-8 xs:h-10'} text-sm xs:text-base overflow-hidden duration-200`}>
                    <div className={`p-2 grid grid-cols-3 grid-flow-col overflow-hidden bg-black/20`}>
                        <div>
                            <span className='font-bold pe-1'>{data.blogPostCount}</span>
                            <span className='text-gray-500 pe-3'>Blog posts</span>
                        </div>
                        <div>
                            <span className='font-bold pe-1'>{data.replyCount}</span>
                            <span className='text-gray-500 pe-3'>Replies</span>
                        </div>
                        <div>
                            <span className='font-bold pe-1'>{data.ownedPetCount}</span>
                            <span className='text-gray-500 pe-3'>Owned pets</span>
                        </div>
                    </div>
                </div>
            </form>
        )}/>
    )
}