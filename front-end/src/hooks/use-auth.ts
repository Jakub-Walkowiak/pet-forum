import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useInterval } from 'usehooks-ts'

export default function useAuth() {
    const [authId, setAuthId] = useState<number>()

    const verifyAuth = () => {
        const tokenEncoded = Cookies.get('login_token')
        if (tokenEncoded !== undefined) setAuthId(Number((<{id: string}>jwtDecode(tokenEncoded)).id))
        else setAuthId(undefined)
    }

    useEffect(() => {
        verifyAuth()

        const handleRefresh =  () => verifyAuth()
    
        document.addEventListener('refreshauth', handleRefresh)
        return () => document.removeEventListener('refreshauth', handleRefresh)
    }, [])
    useInterval(verifyAuth, 2000)
    
    return authId
}