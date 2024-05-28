import { useEffect, useState } from "react"

export default function useEmail() {
    const [email, setEmail] = useState<string>()

    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/accounts/email', { credentials: 'include' })
        if (!response.ok) setEmail(undefined)
        else setEmail(await response.json())
    }

    useEffect(() => { try { fetchData() } catch(err) { setEmail(undefined) } }, [])
    useEffect(() => {
        document.addEventListener('refreshprofile', fetchData)
        return () => document.removeEventListener('refreshprofile', fetchData)
    })

    return email
}