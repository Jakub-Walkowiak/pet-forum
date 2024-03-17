import React from "react"
import { AiOutlineLoading } from "react-icons/ai"

interface ButtonProps {
    dark?: boolean,
    text?: string,
    onClickHandler?: VoidFunction,
    disabled?: boolean,
    loading?: boolean,
}

export default function Button({ dark = false, text, onClickHandler, disabled = false, loading = false }: ButtonProps) {
    const baseStyle = 'border inline-flex justify-center rounded-lg p-2 font-medium duration-200 enabled:hover:bg-opacity-80 disabled:bg-black/30 disabled:text-zinc-700 enabled:active:scale-95 enabled:active:scale-95'

    const colorModeStyle = dark
        ? 'enabled:hover:bg-emerald-700 border-zinc-700 disabled:border-0'
        : 'border-0 bg-emerald-500'

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        if (loading) return
        if (onClickHandler !== undefined) onClickHandler()
    }

    return (
        <button onClick={handleClick} className={`${baseStyle} ${colorModeStyle} ${loading && 'cursor-wait'}`} disabled={disabled || loading}>{loading ? <AiOutlineLoading className="font-xl animate-spin"/> : text}</button>
    )
}