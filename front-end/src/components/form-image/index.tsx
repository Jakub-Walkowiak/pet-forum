import Image from "next/image"
import { MouseEventHandler, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import BlurOverlay from "../blur-overlay"

interface FormImageProps {
    src: string,
    remove: MouseEventHandler<SVGElement>,
}

export default function FormImage({ src, remove }: FormImageProps) {
    const [fullImage, setFullImage] = useState(false)

    const stopEvent = (e: React.BaseSyntheticEvent) => e.stopPropagation()

    return (
        <div className={`relative h-12 w-12 sm:h-16 sm:w-16`}>
            <Image src={src} alt='' layout='fill' objectFit="cover" className={`rounded-lg hover:cursor-pointer`} onClick={() => setFullImage(true)}/>
            <AiOutlineClose className="rounded-full p-px text-xl text-white bg-black/60 absolute right-1 top-1 hover:cursor-pointer" onClick={remove}/>

            {fullImage && ( 
                <>
                    <BlurOverlay/>
                    <div className="fixed h-5/6 w-5/6 z-50 inset-x-0 inset-y-0 m-auto" onDragOver={stopEvent} onDragEnter={stopEvent}>
                        <Image layout="fill" alt='' src={src} objectFit="contain"/>
                        <AiOutlineClose className="rounded-full p-px text-4xl text-white bg-black/60 absolute right-1 top-1 hover:cursor-pointer" onClick={() => setFullImage(false)}/>
                    </div>
                </>
            )}
        </div>
    )
}