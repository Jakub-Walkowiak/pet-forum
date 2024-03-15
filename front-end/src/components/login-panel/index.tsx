'use client'

import useAuthId from '@/hooks/use-auth';
import LoggedIn from './logged-in';
import LoggedOut from './logged-out';

export default function LoginPanel() {
    const authId = useAuthId()

    return authId !== undefined
        ? <LoggedIn authId={authId}/>
        : <LoggedOut/>
}