interface ValueAndTextProps {
    value: number,
    text: string,
    onClick?: (e: React.MouseEvent) => void
    className?: string,
}

export default function ValueAndText({ value, text, onClick, className }: ValueAndTextProps) {
    return (
        <div className={`${className} ${onClick && 'group cursor-pointer'}`} onClick={onClick}>
            <span className={`font-bold pe-1`}>{value}</span>
            <span className={`text-gray-500 ${onClick && 'group-hover:underline'}`}>{text}</span>
        </div>
    )
}