import getTimeSinceString from "./get-time-since-string";

interface TimeLabelProps {
    date: Date,
}

export default function TimeLabel({ date }: TimeLabelProps) {
    return <p title={date.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})} 
        className='flex-1 flex justify-end items-center font-normal text-sm text-zinc-500 truncate block'>{getTimeSinceString(date)}</p>
}