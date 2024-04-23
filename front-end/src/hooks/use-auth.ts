import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useInterval } from 'usehooks-ts'

export default function useAuth() {
    const [authId, setAuthId] = useState<number>()

    const verifyAuth = async () => {
        const tokenEncoded = Cookies.get('login_token')
        if (tokenEncoded !== undefined) {
            const decoded = Number((<{id: string}>jwtDecode(tokenEncoded)).id)
            const response = await fetch(`http://localhost:3000/accounts/${decoded}`)
            if (response.status !== 404) setAuthId(decoded)
            else Cookies.remove('login_token', { path: '' })
        }
        else setAuthId(undefined)
    }

    useEffect(() => {
        verifyAuth()

        const handleRefresh = () => verifyAuth()
    
        document.addEventListener('refreshauth', handleRefresh)
        return () => document.removeEventListener('refreshauth', handleRefresh)
    }, [])
    useInterval(verifyAuth, 2000)
    
    return authId
}