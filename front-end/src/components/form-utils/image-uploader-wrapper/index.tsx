import showNotificationPopup from "@/helpers/show-notification-popup"
import Compressor from "compressorjs"
import { useEffect, useId, useState } from "react"

export enum ImageError {
    InvalidType,
    TooMany,
}

export class UploaderImages {
    urls: Array<string>
    maxCount: number
    forceSquare: boolean
    maxResX: number
    maxResY: number
    overrideOnMax?: boolean

    constructor(maxCount: number, forceSquare: boolean, maxResX?: number, maxResY?: number, overrideOnMax?: boolean) {
        this.maxCount = maxCount
        this.forceSquare = forceSquare
        this.maxResX = maxResX ?? 4096
        this.maxResY = maxResY ?? 4096
        this.overrideOnMax = overrideOnMax

        this.urls = new Array<string>()
    }

    add = async (file: File) => {
        if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp') return ImageError.InvalidType
        if (this.maxCount <= this.urls.length && !this.overrideOnMax) return ImageError.TooMany
        else {
            const url: string = await new Promise(resolve => {
                new Compressor(file, {
                    mimeType: 'image/webp',
                    quality: 75,
                    maxWidth: this.maxResX,
                    maxHeight: this.maxResY,
                    width: this.forceSquare ? (this.maxResX < this.maxResY ? this.maxResX : this.maxResY) : undefined,
                    height: this.forceSquare ? (this.maxResX < this.maxResY ? this.maxResX : this.maxResY) : undefined,
                    resize: 'cover',
                    success: (result) => resolve(URL.createObjectURL(result))
                })
            })

            if (!this.overrideOnMax) this.urls.push(url)
            else this.urls.splice(0, 0, url)
        }
    }

    remove = (index: number) => {
        URL.revokeObjectURL(this.urls[index])
        this.urls.splice(index, 1)
    }

    upload = async () => {
        if (this.urls.length === 0) return undefined

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
    overrideOnMax?: boolean,
}

export default function ImageUploaderWrapper({ render, maxCount = 1, maxResX, maxResY, forceSquare = false, overrideOnMax = false }: ImageUploaderWrapperProps) {
    const [update, setUpdate] = useState(false)
    const [useDragStyle, setUseDragStyle] = useState(false)
    const [images] = useState(new UploaderImages(maxCount, forceSquare, maxResX, maxResY, overrideOnMax))

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
            if (response === ImageError.TooMany) showNotificationPopup(false, `Max number of images is ${images.maxCount}`)
            else if (response === ImageError.InvalidType) showNotificationPopup(false, `Unsupported filed type`)
            setUpdate(true)
        }

        for (let i = 0; i < e.dataTransfer.files.length; ++i) {
            const currentFile = e.dataTransfer.files.item(i) as File
            images.add(currentFile).then(handleResponse)
        }
    }

    return (
        <div id={wrapperId}
            onDragLeave={handleLeave}
            onDragEnter={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
            className='h-fit relative'>
            
            {useDragStyle && <div id={overlayId} className='w-full h-full absolute top-0 left-0 z-[100] bg-emerald-950/20 outline-4 outline-dashed outline-emerald-700 rounded-lg -outline-offset-[12px]'/>}
            <object data={'placeholder-icon.svg'} className={`inset-x-0 inset-y-0 m-auto absolute stroke-emerald-700 w-12 ${!useDragStyle && 'hidden'}`}/>
            {render(images)}
        </div>
    )
}                      