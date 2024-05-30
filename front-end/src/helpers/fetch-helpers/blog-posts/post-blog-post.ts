import UploaderImages from '@/components/forms/utils/image-uploader-wrapper/uploader-images'
import { z } from 'zod'

export type PostUploadError = 'images' | 'tags'

export const PostContentsValidator = z
  .string()
  .trim()
  .min(1, { message: 'Post must contain at least one character' })
  .max(300, { message: "Post can't contain more than 300 characters" })

export default async function postBlogPost(
  contents: string,
  images: UploaderImages,
  replyTo?: number,
  pets?: Array<number>,
  tags?: { added?: Array<string>; selected?: Array<number> },
): Promise<Response | PostUploadError> {
  if (tags === undefined) tags = {}
  if (tags.added === undefined) tags.added = []
  if (tags.selected === undefined) tags.selected = []

  let pictures: Array<number> | undefined
  if (images.urls.length !== 0) {
    const imagesResponse = await images.upload()
    if (imagesResponse === undefined || !imagesResponse.ok) return 'images'
    else pictures = ((await imagesResponse.json()) as { id: number }[]).map((value) => value.id)
  }

  const tagPromises = tags.added.map((name) =>
    fetch('http://localhost:3000/blog-posts/tags', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    }),
  )

  const tagResponses = await Promise.all(tagPromises)
  if (tagResponses.some((response) => !response.ok)) return 'tags'
  const tagsAdded = await Promise.all(
    tagResponses.map(async (response) => ((await response.json()) as { id: number }).id),
  )
  const totalTags = tagsAdded.concat(tags.selected)

  return fetch('http://localhost:3000/blog-posts', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify({ replyTo, contents, pictures, tags: totalTags, pets }),
    headers: { 'Content-Type': 'application/json' },
  })
}
