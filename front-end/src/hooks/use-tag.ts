import { useEffect, useState } from 'react'

export interface TagData {
  tagName: string
  timesUsed: number
}

export default function useTag(id: number) {
  const [tagData, setTagData] = useState<TagData | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/blog-posts/tags/${id}`)
      if (!response.ok) setTagData(undefined)
      else setTagData(await response.json())
    }
    try {
      fetchData()
    } catch (err) {
      setTagData(undefined)
    }
  }, [id])

  return tagData
}
