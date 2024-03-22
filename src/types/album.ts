import type { File } from './file'

export interface AlbumFile extends File {
  albumId: string
  album: Album
}

export interface Album {
  readonly _id: string
  name: string
  url?: string
  draft: boolean
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
