import { AiOutlineExclamationCircle } from 'react-icons/ai';

export default function PostImageError() {
    return <div onClick={e => e.stopPropagation()} className='cursor-default rounded-lg w-full h-full py-8 bg-red-800 flex items-center justify-center font-bold text-red-500 text-4xl'><AiOutlineExclamationCircle/></div>
}