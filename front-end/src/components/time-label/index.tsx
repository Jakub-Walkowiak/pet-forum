import getTimeSinceString from "./get-time-since-string";

interface TimeLabelProps {
    date: Date,
}

export default function TimeLabel({ date }: TimeLabelProps) {
    return <span title={date.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})} 
        className='h-full w-full flex items-center justify-end font-normal text-sm text-zinc-500 truncate'>{getTimeSinceString(date)}</span>
}