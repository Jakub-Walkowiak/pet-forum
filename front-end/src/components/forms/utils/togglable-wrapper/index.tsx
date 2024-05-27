import { ReactNode } from "react"

interface TogglableWrapperProps {
    innerRenderer: (state?: boolean) => ReactNode,
    baseState?: boolean,
    form?: {
        watcher?: boolean,
        set?: (state?: boolean) => void,
    }
    watcher?: boolean,
    text?: { true: string, false: string }
    className?: string
}

export default function TogglableWrapper({ innerRenderer, baseState, form, text, className }: TogglableWrapperProps) {
    const toggleFollowedVisible = () => {
        if (!form?.set) return
        if (form.watcher === undefined && baseState !== undefined) form.set(!baseState)
        else if (form.watcher !== undefined) form.set(!form.watcher)
    }

    return (
        <span className={`${className} cursor-pointer border-b border-emerald-500 hover:bg-emerald-400/20 duration-200 group relative`}>
            <div className={`group-hover:opacity-30 duration-200 ${form?.watcher !== undefined ? form.watcher ? 'opacity-100' : 'opacity-20' : baseState ? 'opacity-100' : 'opacity-20'}`}>
                {innerRenderer(form?.watcher !== undefined ? form?.watcher : baseState !== undefined ? baseState : undefined)}
            </div>
            <span className='flex justify-center font-bold items-center inset-0 m-auto absolute opacity-0 group-hover:opacity-100 duration-200' onClick={toggleFollowedVisible}>
                {form?.watcher !== undefined 
                    ? form.watcher ? text?.true : text?.false
                    : baseState !== undefined 
                        ? baseState ? text?.true : text?.false
                        : ''}
            </span>
        </span>
    )
}