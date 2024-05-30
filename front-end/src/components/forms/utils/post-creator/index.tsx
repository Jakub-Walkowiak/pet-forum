'use client'

import FormImage from '@/components/images/form-image'
import postBlogPost, { PostContentsValidator } from '@/helpers/fetch-helpers/blog-posts/post-blog-post'
import showFloatingElement from '@/helpers/show-floating-element'
import showNotificationPopup from '@/helpers/show-notification-popup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineBug, AiOutlineFileImage, AiOutlineTags } from 'react-icons/ai'
import { z } from 'zod'
import SelectableBlogTagForm from '../../selectable-forms/blog-tag-form'
import SelectablePetForm from '../../selectable-forms/pet-form'
import Button from '../button'
import ImageUploaderWrapper from '../image-uploader-wrapper'
import UploaderImages, { ImageError } from '../image-uploader-wrapper/uploader-images'

interface PostCreatorProps {
  placeholder: string
  replyTo?: number
  maxRows: number
  afterSubmit?: (id: number) => void
}

const PostCreatorValidator = z.object({
  contents: PostContentsValidator,
})

type PostCreatorInputs = z.infer<typeof PostCreatorValidator>

export default function PostCreator({ placeholder, replyTo, maxRows, afterSubmit }: PostCreatorProps) {
  const fileInputId = useId()
  const [update, setUpdate] = useState(false)
  const [textLength, setTextLength] = useState(0)

  const [selectedTags, setSelectedTags] = useState(new Array<number>())
  const [addedTags, setAddedTags] = useState(new Array<string>())
  const [selectedPets, setSelectedPets] = useState(new Array<number>())

  useEffect(() => setUpdate(false), [update])

  const handleFileChange = async (images: UploaderImages, e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files === null || files.length === 0) return

    // @ts-ignore <- ts thinks that files can be null here, even though i've already checked for it by now 🤔
    for (let i = 0; i < files.length; ++i)
      // @ts-ignore <- ditto (somehow this wasn't being flagged before??)
      await images.add(files.item(i)).then((response) => {
        if (response === ImageError.InvalidType) showNotificationPopup(false, 'Unsupported file type')
        else if (response === ImageError.TooMany)
          showNotificationPopup(false, `Max. num. of images is ${images.maxCount}`)
      })

    setUpdate(true)
  }

  const handleFileButtonClick = () => {
    document.getElementById(fileInputId)?.click()
  }

  const handleTagButtonClick = (e: React.MouseEvent<SVGElement>) => {
    showFloatingElement(
      <SelectableBlogTagForm
        selectable={{ selected: selectedTags, set: setSelectedTags }}
        added={{ values: addedTags, set: setAddedTags }}
      />,
      e.clientX,
      e.clientY,
    )
  }

  const handlePetButtonClick = (e: React.MouseEvent<SVGElement>) => {
    showFloatingElement(
      <SelectablePetForm selectable={{ selected: selectedPets, set: setSelectedPets }} />,
      e.clientX,
      e.clientY,
    )
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
      const response = await postBlogPost(contents, images, replyTo, selectedPets, {
        added: addedTags,
        selected: selectedTags,
      })

      if (response === 'images') showNotificationPopup(false, 'Failed to upload images')
      else if (response === 'tags') showNotificationPopup(false, 'Failed to attach tags')
      else if (response.status === 401) showNotificationPopup(false, 'Authentication failed')
      else if (response.status === 403) showNotificationPopup(false, 'You lack ownership of 1+ pets')
      else if (response.ok || response.status === 404) {
        for (let i = images.urls.length - 1; i >= 0; --i) images.remove(i)
        setAddedTags([])
        setSelectedTags([])
        setSelectedPets([])
        setValue('contents', '')

        showNotificationPopup(true, response.ok ? 'Post created successfully' : 'Post created (attachment failure)')
        if (afterSubmit) afterSubmit((await response.json()).id)
      } else showNotificationPopup(false, 'Encountered server errror')
    } catch (err) {
      showNotificationPopup(false, 'Error contacting server')
    }
  }

  return (
    <ImageUploaderWrapper
      maxCount={10}
      render={(images) => (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data.contents, images))}
          className={`gap-2 flex flex-col items-center justify-center w-full h-fit bg-gray-800 rounded-lg p-2 font-medium duration-200 hover:bg-black/20 focus:bg-black/20 focus:scale-[1.02] ${errorStyles}`}
        >
          <div className='w-full flex relative'>
            <textarea
              onInputCapture={(e) => setTextLength(e.currentTarget.value.length)}
              rows={1}
              placeholder={placeholder}
              onInput={handleTextAreaExpansion}
              {...register('contents')}
              className='w-full focus:outline-none bg-transparent resize-none'
            />
            <span className={getErrorState() || textLength > 300 ? 'text-red-700' : 'text-gray-400'}>
              {300 - textLength}
            </span>
          </div>
          <ul className={`gap-1.5 list-none w-full h-fit flex flex-wrap ${images.urls.length === 0 && 'hidden'}`}>
            {images.urls.map((url, index) => (
              <li key={url}>
                <FormImage src={url} remove={() => handleRemoval(images, index)} />
              </li>
            ))}
          </ul>
          <div className='w-full h-px bg-gray-600' />
          <div className='w-full h-fit flex justify-between'>
            <div>
              <input
                multiple
                id={fileInputId}
                type='file'
                accept='image/png, image/jpeg, image/webp'
                className='hidden'
                onChange={(e) => handleFileChange(images, e)}
              />

              <AiOutlineFileImage
                className='h-full text-xl text-gray-400 inline me-2 hover:cursor-pointer hover:text-white duration-200'
                onClick={handleFileButtonClick}
              />
              <AiOutlineTags
                className='h-full text-xl text-gray-400 inline me-2 hover:cursor-pointer hover:text-white duration-200'
                onClick={handleTagButtonClick}
              />
              <AiOutlineBug
                className='h-full text-xl text-gray-400 inline me-2 hover:cursor-pointer hover:text-white duration-200'
                onClick={handlePetButtonClick}
              />
            </div>
            <Button
              disabled={getErrorState()}
              className='!p-1.5 text-md'
              text={replyTo !== undefined ? 'Reply' : 'Post'}
            />
          </div>
        </form>
      )}
    />
  )
}
