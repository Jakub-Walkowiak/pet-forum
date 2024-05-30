import getTimeSinceString from './get-time-since-string'

interface TimeLabelProps {
  date: Date
  mode?: 'compact' | 'date' | 'datetime'
  prefix?: string
}

export default function TimeLabel({ date, mode = 'compact', prefix }: TimeLabelProps) {
  const fullDate = date.toLocaleString('default', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  if (mode === 'compact')
    return (
      <span
        title={fullDate}
        className='h-full w-full flex items-center justify-end font-normal text-sm text-zinc-500 truncate'
      >
        {prefix} {getTimeSinceString(date)}
      </span>
    )
  else if (mode === 'datetime')
    return (
      <span className='h-full w-full flex items-center justify-end text-md text-zinc-500 truncate font-medium'>
        {prefix} {fullDate}
      </span>
    )
  else
    return (
      <span
        title={fullDate}
        className='h-full w-full flex items-center justify-end text-md text-zinc-500 truncate font-medium'
      >
        {prefix} {date.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
      </span>
    )
}
