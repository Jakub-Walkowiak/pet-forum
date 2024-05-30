'use client'

import { ReactNode, useEffect, useState } from 'react'

interface Tab {
  title: string
  element: ReactNode
  onDoubleClick?: () => void
}

interface TabContainerProps {
  tabs: Array<Tab>
  header?: React.ReactNode
}

export default function TabContainer({ tabs, header }: TabContainerProps) {
  const [selected, setSelected] = useState(0)
  const [prevScrollTop, setPrevScrollTop] = useState(0)
  const [hidePanel, setHidePanel] = useState(false)
  const [scrollPositions, setScrollPositions] = useState(new Array(tabs.length).fill(0))

  useEffect(() => {
    const handleScroll = () =>
      setPrevScrollTop((old) => {
        if (old !== document.documentElement.scrollTop) setHidePanel(old > document.documentElement.scrollTop)
        return document.documentElement.scrollTop
      })

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.documentElement.scrollTo({ top: scrollPositions[selected], behavior: 'auto' })
  }, [selected, scrollPositions])

  const handleClick = (tab: Tab, idx: number) => {
    if (idx !== selected) {
      setScrollPositions((old) => old.toSpliced(selected, 1, document.documentElement.scrollTop))
      setSelected(idx)
    } else if (tab.onDoubleClick) tab.onDoubleClick()
  }

  return (
    <div className='w-full relative z-0'>
      <ul
        className={`h-min flex w-full border-b border-zinc-700 sticky ${hidePanel ? 'top-0 sm:-top-16' : 'top-16 sm:top-0'} duration-200 z-10 bg-gray-900`}
      >
        {tabs.map((row, idx) => (
          <li
            className={`${idx === selected ? 'bg-black/10 after:w-full' : 'cursor-pointer'} ${row.onDoubleClick && 'cursor-pointer'} relative h-14 flex-1 flex items-center justify-center font-semibold text-xl hover:bg-black/20 after:block after:absolute after:w-0 after:bg-emerald-600 after:h-0.5 after:duration-200 after:ease-in-out hover:after:w-full after:inset-x-0 after:mx-auto after:bottom-0 duration-200`}
            key={row.title}
            onClick={() => handleClick(row, idx)}
          >
            {row.title}
          </li>
        ))}
      </ul>

      {header}

      <ul>
        {tabs.map((row, idx) => (
          <li className={idx === selected ? 'visible' : 'hidden'} key={row.title}>
            {row.element}
          </li>
        ))}
      </ul>
    </div>
  )
}
