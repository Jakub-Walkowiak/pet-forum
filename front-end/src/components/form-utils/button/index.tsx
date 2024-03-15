interface ButtonProps {
    dark?: boolean,
    text?: string,
    onClickHandler?: VoidFunction,
    disabled?: boolean,
}

export default function Button({ dark = false, text, onClickHandler, disabled = false }: ButtonProps) {
    const styles = dark
        ? 'rounded-lg p-2 font-medium duration-200 enabled:hover:bg-opacity-80 disabled:bg-black/30 disabled:text-zinc-700 enabled:hover:bg-emerald-700 enabled:active:scale-95 border border-zinc-700'
        : 'rounded-lg p-2 font-medium duration-200 enabled:hover:bg-opacity-80 disabled:bg-black/30 disabled:border disabled:border-zinc-700 disabled:text-zinc-700 enabled:active:scale-95 bg-emerald-500'

    return (
        <button onClick={onClickHandler} className={styles} disabled={disabled}>{text}</button>
    )
}