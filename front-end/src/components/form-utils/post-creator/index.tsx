import FormImage from "@/components/images/form-image";
import showNotificationPopup from "@/helpers/show-notification-popup";
import showTagPanel from "@/helpers/show-tag-panel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineFileImage, AiOutlineTags } from "react-icons/ai";
import { z } from "zod";
import Button from "../button";
import ImageUploaderWrapper, { ImageError, UploaderImages } from "../image-uploader-wrapper";

interface PostCreatorProps {
    placeholder: string,
    replyTo?: number,
    maxRows: number,
    afterSubmit?: VoidFunction,
}

const PostCreatorValidator = z
    .object({
        contents: z.string().trim()
            .min(1, { message: 'Post must contain at least one character' })
            .max(300, { message: 'Post can\'t contain more than 300 characters' }),
    })

type PostCreatorInputs = z.infer<typeof PostCreatorValidator>

export default function PostCreator({ placeholder, replyTo, maxRows, afterSubmit }: PostCreatorProps) {
    const fileInputId = useId()
    const [update, setUpdate] = useState(false)
    const [textLength, setTextLength] = useState(0)

    const [selectedTags, setSelectedTags] = useState(new Array<number>())
    const [addedTags, setAddedTags] = useState(new Array<string>())

    useEffect(() => setUpdate(false), [update])

    const handleFileChange = async (images: UploaderImages, e: React.FormEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files === null || files.length === 0) return

        // @ts-ignore
        for (let i = 0; i < files.length; ++i) await images.add(files.item(i)).then(response => {
            if (response === ImageError.InvalidType) showNotificationPopup(false, 'Unsupported file type')
            else if (response === ImageError.TooMany) showNotificationPopup(false, `Max. num. of images is ${images.maxCount}`)
        })

        setUpdate(true)
    }

    const handleFileButtonClick = () => {
        document.getElementById(fileInputId)?.click()
    }

    const handleTagButtonClick = (e: React.MouseEvent<SVGElement>) => {
        showTagPanel({ selected: selectedTags, setSelected: setSelectedTags, added: addedTags, setAdded: setAddedTags, x: e.clientX, y: e.clientY })
    }

    const handleTextAreaExpansion = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.currentTarget.rows = 1
        e.currentTarget.rows = e.currentTarget.scrollHeight / 24 > maxRows ? maxRows : e.currentTarget.scrollHeight / 24
    }

    const handleRemoval = (images: UploaderImages, index: number) => {
        images.remove(index)
        setUpdate(true)
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<PostCreatorInputs>({
        resolver: zodResolver(PostCreatorValidator),
    })

    const getErrorState = () => errors.contents !== undefined

    const errorStyles = getErrorState()
        ? 'border border-zinc-700 outline outline-2 outline-offset-2 outline-red-800 bg-red-200/20 text-red-800 focus:text-white'
        : '!outline-none border border-zinc-700'

    const onSubmit = async (contents: string, images: UploaderImages) => {
        try {
            let pictures: Array<number> | undefined
            if (images.urls.length !== 0) {
                const imagesResponse = await images.upload()
                if (imagesResponse === undefined || !imagesResponse.ok) {
                    showNotificationPopup(false, 'Error uploading images')
                    return
                } else pictures = ((await imagesResponse.json()) as { id: number }[]).map(value => value.id)
            }

            const tagPromises = addedTags.map(name => fetch('http://localhost:3000/blog-posts/tags', {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ name }),
                headers: { 'Content-Type': 'application/json' }
            }))

            const tagResponses = await Promise.all(tagPromises)
            for (let i = 0; i < tagResponses.length; ++i) {
                if (tagResponses[i].status === 401) {
                    showNotificationPopup(false, 'Authentication failed')
                    return
                } else if (tagResponses[i].status === 409) {
                    showNotificationPopup(false, 'Tried to add duplicate tag')
                    return
                } else if (!tagResponses[i].ok) {
                    showNotificationPopup(false, 'Error adding tag')
                    return
                }
            }
            const tagsAdded = await Promise.all(tagResponses.map(async response => ((await response.json()) as { id: number }).id ))
            const tags = tagsAdded.concat(selectedTags)

            const postResponse = await fetch('http://localhost:3000/blog-posts', {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ replyTo, contents, pictures, tags }),
                headers: { 'Content-Type': 'application/json' }
            })

            if (postResponse.status === 401) showNotificationPopup(false, 'Authentication failed')
            else if (!postResponse.ok && postResponse.status !== 404) showNotificationPopup(false, 'Encountered server errror')
            else {
                for (let i = images.urls.length - 1; i >= 0 ; --i) images.remove(i)
                setAddedTags([])
                setSelectedTags([])
                setValue('contents', '')

                if (postResponse.status === 404) showNotificationPopup(false, 'Failed to attach resources')
                else { 
                    showNotificationPopup(true, 'Post created successfully!')
                    if (afterSubmit) afterSubmit()
                }
            }
        } catch (err) { showNotificationPopup(false, 'Error contacting server') }
    }

    return (
        <ImageUploaderWrapper maxCount={10} render={images => (
            <form onSubmit={handleSubmit(data => onSubmit(data.contents, images))} className={`gap-2 flex flex-col items-center justify-center w-full h-fit bg-gray-800 rounded-lg p-2 font-medium duration-200 hover:bg-black/20 focus:bg-black/20 focus:scale-[1.02] ${errorStyles}`}>
                <div className='w-full relative flex relative'>
                    <textarea onInputCapture={e => setTextLength(e.currentTarget.value.length)} rows={1} placeholder={placeholder} onInput={handleTextAreaExpansion} {...register('contents')} className='w-full focus:outline-none bg-transparent resize-none'/>
                    <span className={getErrorState() || textLength > 300 ? 'text-red-700' : 'text-gray-400'}>{300 - textLength}</span>
                </div>
                <ul className={`gap-1.5 list-none w-full h-fit flex flex-wrap ${images.urls.length === 0 && 'hidden'}`}>
                    {images.urls.map((url, index) => (
                        <li key={url}><FormImage src={url} remove={() => handleRemoval(images, index)}/></li>
                    ))}
                </ul>
                <div className="w-full h-px bg-gray-600"/>
                <div className="w-full h-fit flex justify-between">
                    <div>
                        <input multiple id={fileInputId} type='file' accept='image/png, image/jpeg, image/webp' className='hidden' onChange={e => handleFileChange(images, e)}/>

                        <AiOutlineFileImage className="h-full text-xl text-gray-400 inline me-2 hover:cursor-pointer hover:text-white duration-200" onClick={handleFileButtonClick}/>
                        <AiOutlineTags className="h-full text-xl text-gray-400 inline me-2 hover:cursor-pointer hover:text-white duration-200" onClick={handleTagButtonClick}/>
                    </div>
                    <Button disabled={getErrorState()} className='!p-1.5 text-md' text={replyTo !== undefined ? 'Reply' : 'Post'}/>
                </div>
            </form>
        )}/>
    )
}