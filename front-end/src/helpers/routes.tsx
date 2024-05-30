import { ReactNode } from 'react'
import { AiOutlineBug, AiOutlineHome, AiOutlineSearch, AiOutlineSetting } from 'react-icons/ai'

interface Route {
  name: string
  path: string
  icon: ReactNode
  navbar: boolean
}

export const routes: Array<Route> = [
  { name: 'Home', path: '/', icon: <AiOutlineHome />, navbar: true },
  { name: 'Account', path: '/account', icon: <AiOutlineSetting />, navbar: false },
  { name: 'Pets', path: '/pets/manage/', icon: <AiOutlineBug />, navbar: true },
  { name: 'Search', path: '/search', icon: <AiOutlineSearch />, navbar: true },
]
