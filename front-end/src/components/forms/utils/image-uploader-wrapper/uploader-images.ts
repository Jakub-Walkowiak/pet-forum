import Compressor from 'compressorjs'

export enum ImageError {
  InvalidType,
  TooMany,
}

export default class UploaderImages {
  urls: Array<string>
  maxCount: number
  forceSquare: boolean
  maxResX: number
  maxResY: number
  overrideOnMax: boolean

  constructor(maxCount: number, forceSquare: boolean, maxResX?: number, maxResY?: number, overrideOnMax?: boolean) {
    this.maxCount = maxCount
    this.forceSquare = forceSquare
    this.maxResX = maxResX ?? 4096
    this.maxResY = maxResY ?? 4096
    this.overrideOnMax = overrideOnMax ?? false

    this.urls = new Array<string>()
  }

  add = async (file: File) => {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp')
      return ImageError.InvalidType
    if (this.maxCount <= this.urls.length && !this.overrideOnMax) return ImageError.TooMany
    else {
      const url: string = await new Promise((resolve) => {
        new Compressor(file, {
          mimeType: 'image/webp',
          quality: 75,
          maxWidth: this.maxResX,
          maxHeight: this.maxResY,
          width: this.forceSquare ? (this.maxResX < this.maxResY ? this.maxResX : this.maxResY) : undefined,
          height: this.forceSquare ? (this.maxResX < this.maxResY ? this.maxResX : this.maxResY) : undefined,
          resize: 'cover',
          success: (result) => resolve(URL.createObjectURL(result)),
        })
      })

      if (!this.overrideOnMax) this.urls.push(url)
      else this.urls.splice(0, 1, url)
    }
  }

  remove = (index: number) => {
    URL.revokeObjectURL(this.urls[index])
    this.urls.splice(index, 1)
  }

  upload = async () => {
    if (this.urls.length === 0) return undefined

    try {
      const data: FormData = await new Promise((resolve) => {
        const data = new FormData()

        this.urls.forEach(async (url, index) => {
          const blob = await (await fetch(url)).blob()
          data.append('images', blob)
          if (index === this.urls.length - 1) resolve(data)
        })
      })

      return await fetch('http://localhost:3000/images', {
        method: 'POST',
        mode: 'cors',
        body: data,
      })
    } catch (err) {
      return undefined
    }
  }
}
