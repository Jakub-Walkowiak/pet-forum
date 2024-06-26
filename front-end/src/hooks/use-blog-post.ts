import { useCallback, useEffect, useState } from 'react'

export interface BlogPostData {
  posterId: number
  contents: string
  likeCount: number
  replyCount: number
  datePosted: string
  replyTo?: number
  tags: Array<number>
  images: Array<number>
  liked: boolean
  pets: Array<number>
}

export default function useBlogPost(id: number | undefined) {
  const [data, setData] = useState<BlogPostData>()

  const getData = useCallback(() => {
    const fetchData = async () => {
      if (!id) setData(undefined)
      else {
        const response = await fetch(`http://localhost:3000/blog-posts/${id}`, { credentials: 'include' })
        if (!response.ok) setData(undefined)
        else setData(await response.json())
      }
    }
    try {
      fetchData()
    } catch (err) {
      setData(undefined)
    }
  }, [id])

  useEffect(getData, [id, getData])

  useEffect(() => {
    document.addEventListener('refreshblogpost', getData)
    return () => document.removeEventListener('refreshblogpost', getData)
  }, [getData])

  return data
}
