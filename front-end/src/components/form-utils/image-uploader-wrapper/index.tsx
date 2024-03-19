import showNotificationPopup from "@/helpers/show-notification-popup"
import Compressor from "compressorjs"
import { useEffect, useId, useState } from "react"
import { getImageSize } from "react-image-size"

enum ImageError {
    TooWide,
    TooTall,
    NotSquare,
    TooMany,
}

class UploaderImages {
    urls: Array<string>
    maxCount: number
    forceSquare: boolean
    maxResX?: number
    maxResY?: number

    constructor(maxCount: number, forceSquare: boolean, maxResX?: number, maxResY?: number) {
        this.maxCount = maxCount
        this.forceSquare = forceSquare
        this.maxResX = maxResX
        this.maxResY = maxResY

        this.urls = new Array<string>()
    }

    add = async (file: File) => {
        if (this.maxCount <= this.urls.length) return ImageError.TooMany
        else {
            const url: string = await new Promise(resolve => {
                new Compressor(file, {
                    mimeType: 'image/webp',
                    quality: 75,
                    success: (result) => resolve(URL.createObjectURL(result))
                })
            })

            let error: ImageError | undefined
            const dimensions = await getImageSize(url)

            if (this.maxResX !== undefined && dimensions.width > this.maxResX) error = ImageError.TooWide
            else if (this.maxResY !== undefined && dimensions.height > this.maxResY) error = ImageError.TooTall
            else if (this.forceSquare && dimensions.width !== dimensions.height) error = ImageError.NotSquare

            if (error !== undefined) {
                URL.revokeObjectURL(url)
                return error
            } else this.urls.push(url)
        }
    }

    remove = (index: number) => {
        URL.revokeObjectURL(this.urls[index])
        this.urls.splice(index, 1)
    }

    upload = async () => {
        try {
            const data: FormData = await new Promise(resolve => {
                const data = new FormData()

                this.urls.forEach(async (url, index) => { 
                    const blob = await (await fetch(url)).blob()
                    data.append('images', blob)
                    if (index === this.urls.length - 1) resolve(data)
                })
            })

            return (await fetch('http://localhost:3000/images', {
                method: 'POST',
                mode: 'cors',
                body: data,
            }))
        } catch (err) { return undefined }
    }
}

interface ImageUploaderWrapperProps {
    render: (images: UploaderImages) => React.ReactNode,
    maxCount?: number,
    maxResX?: number,
    maxResY?: number,
    forceSquare?: boolean,
}

export default function ImageUploaderWrapper({ render, maxCount = 1, maxResX, maxResY, forceSquare = false }: ImageUploaderWrapperProps) {
    const [update, setUpdate] = useState(false)
    const [useDragStyle, setUseDragStyle] = useState(false)
    const [images] = useState(new UploaderImages(maxCount, forceSquare, maxResX, maxResY))

    const overlayId = useId()
    const wrapperId = useId()

    useEffect(() => setUpdate(false), [update])

    const handleLeave = (e: React.DragEvent<HTMLElement>) => {
        const targetId = (e.target as HTMLDivElement).id
        if (targetId === overlayId || targetId === wrapperId) setUseDragStyle(false)
    }

    const handleDrag = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        setUseDragStyle(true)
    }

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        setUseDragStyle(false)

        const handleResponse = (response?: ImageError) => {
            switch (response) {
                case ImageError.NotSquare:
                    showNotificationPopup(false, 'Image must be square')
                    break

                case ImageError.TooMany:
                    showNotificationPopup(false, `Max number of images is ${images.maxCount}`)
                    break

                case ImageError.TooTall:
                    showNotificationPopup(false, `Max image height is ${images.maxResY}px`)
                    break

                case ImageError.TooWide:
                    showNotificationPopup(false, `Max image width is ${images.maxResX}px`)
                    break
            }

            setUpdate(true)
        }

        for (let i = 0; i < e.dataTransfer.files.length; ++i) {
            const currentFile = e.dataTransfer.files.item(i) as File
            if (currentFile.type === 'image/jpeg' || currentFile.type === 'image/png' || currentFile.type === 'image/webp') images.add(currentFile).then(handleResponse)
            else showNotificationPopup(false, 'Unsupported file type')
        }
    }

    return (
        <div id={wrapperId}
            onDragLeave={handleLeave}
            onDragEnter={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
            className={`w-fit h-fit relative`}>
            
            {useDragStyle && <div id={overlayId} className='w-full h-full absolute top-0 left-0 z-[100] bg-emerald-950/20 outline-4 outline-dashed outline-emerald-700 rounded-lg -outline-offset-[12px]'/>}
            <object data={'placeholder-icon.svg'} className={`inset-x-0 inset-y-0 m-auto absolute stroke-emerald-700 w-12 ${!useDragStyle && 'hidden'}`}/>
            <div className='w-full h-full'>{render(images)}</div>
        </div>
    )
}                      