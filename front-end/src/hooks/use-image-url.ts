import { useEffect, useState } from 'react'

export default function useImageUrl(id: number | undefined) {
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    if (id === undefined) setImageUrl(undefined)
    else {
      const fetchData = async () => {
        const res = await fetch(`http://localhost:3000/images/${id}`)
        if (!res.ok) setImageUrl(undefined)
        else setImageUrl(URL.createObjectURL(await res.blob()))
      }
      try {
        fetchData()
      } catch (err) {
        setImageUrl(undefined)
      }
    }
  }, [id])

  return imageUrl
}
