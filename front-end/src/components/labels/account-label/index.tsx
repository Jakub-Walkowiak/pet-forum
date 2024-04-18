interface AccountLabelProps {
    text: string,
    size?: 'normal' | 'large' | 'extra_large',
    displayName?: boolean,
}

export default function AccountLabel({ text, size = 'normal', displayName = false }: AccountLabelProps) {
    let sizeStyle
    switch (size) {
        case 'normal': sizeStyle = displayName ? 'text-base' : 'text-sm'; break
        case 'large': sizeStyle = displayName ? 'text-lg' : 'text-base'; break
        case 'extra_large': sizeStyle = displayName ? 'text-2xl font-semibold' : 'text-xl'; break
    }

    if (displayName) return <span title={text} className={`flex-none truncate font-medium max-w-full white ${sizeStyle}`}>{text}</span>
    else return <span title={`@${text}`} className={`flex-none font-normal text-zinc-500 max-w-full truncate ${sizeStyle}`}>@{text}</span>
}