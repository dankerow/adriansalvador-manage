export interface AlbumFile {
  readonly id: string
  name: string
  url?: string
  readonly type: string
  readonly size: number
  albumId: string
  album: Album
  readonly createdAt: number
  readonly modifiedAt: number
}

export interface Album {
  readonly id: string
  name: string
  url?: string
  hidden: boolean
  nsfw: boolean
  favorite: boolean
  featured: boolean
  coverId: string | null
  cover?: Omit<AlbumFile, 'albumId' | 'album' | 'createdAt' | 'modifiedAt'>
  coverFallbackId: string | null
  coverFallback?: Omit<AlbumFile, 'albumId' | 'album' | 'createdAt' | 'modifiedAt'>
  fileCount: number
  images: AlbumFile[]
  readonly createdAt: number
  readonly modifiedAt: number
}
