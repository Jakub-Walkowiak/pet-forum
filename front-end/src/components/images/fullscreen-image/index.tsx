import BlurOverlay from '@/components/utils/blur-overlay'
import stopEvent from '@/helpers/stop-event'
import Image from 'next/image'
import { AiOutlineClose } from 'react-icons/ai'

interface FullscreenImageProps {
  src: string
  hide: VoidFunction
}

export default function FullscreenImage({ src, hide }: FullscreenImageProps) {
  return (
    <>
      <BlurOverlay />
      <div className='fixed h-5/6 w-5/6 z-50 inset-x-0 inset-y-0 m-auto' onDragOver={stopEvent} onDragEnter={stopEvent}>
        <Image layout='fill' alt='Fullscreen image' src={src} objectFit='contain' />
        <AiOutlineClose
          className='rounded-full p-px text-4xl text-white bg-black/60 absolute right-1 top-1 hover:cursor-pointer'
          onClick={hide}
        />
      </div>
    </>
  )
}
