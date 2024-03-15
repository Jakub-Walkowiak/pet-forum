import { ReactNode } from "react"

interface ErrorContainerProps {
    children: ReactNode,
}

export default function ErrorContainer({ children }: ErrorContainerProps) {
    return <div className='text-xs sm:text-sm text-red-700 font-semibold flex flex-col items-center bg-gray-800 p-2 rounded-lg empty:hidden border border-zinc-700 animate-pop-in'>{children}</div>
}