'use client'

import useAuth from '@/hooks/use-auth'
import LoggedIn from './logged-in'
import LoggedOut from './logged-out'

export default function AccountPanelCompact() {
    const auth = useAuth()

    if (auth) return <LoggedIn authId={auth}/>
    else return <LoggedOut/>
}