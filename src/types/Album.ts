export interface AlbumFile {
  url: string
  readonly id: string
  name: string
  readonly type: string
  readonly size: number
  albumId: string
  album?: object
  readonly createdAt: string
  readonly updatedAt: string
}

export interface Album {
  readonly id: string
  name: string
  hidden: boolean
  nsfw: boolean
  favorite: boolean
  featured: boolean
  readonly createdAt: string
  readonly updatedAt: string
  fileCount: number
  images: AlbumFile[]
}
