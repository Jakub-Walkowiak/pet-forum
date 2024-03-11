interface ButtonProps {
    dark?: boolean,
    text?: string,
    onClickHandler?: VoidFunction,
}

export default function Button({ dark = false, text, onClickHandler }: ButtonProps) {
    const styles = dark
        ? 'rounded-lg p-2 font-medium hover:opacity-90 active:scale-95 border border-zinc-700'
        : 'rounded-lg p-2 font-medium hover:opacity-90 active:scale-95 bg-emerald-500'

    return (
        <button onClick={onClickHandler} className={styles}>{text}</button>
    )
}